package bonsai.Utils.ImageTransHandler;

import bonsai.Constants;
import bonsai.Utils.CommonUtils;
import bonsai.Utils.UploadFileUtil;
import bonsai.config.DBBasedConfigs;
import org.apache.commons.io.FileUtils;
import org.openslide.OpenSlide;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static bonsai.Utils.UploadFileUtil.BUFFER_SIZE;

public class MrxsDealUtil {
    private static final Logger LOG = LoggerFactory.getLogger(UploadFileUtil.class);
    //private static String unzipDir = null;

    public static String mrxsTrans(String sourcePath, String destPath, String folderPath) {
        String sourcePathOut = mrxsZipToFile(sourcePath, folderPath);
        if(sourcePathOut.equals(sourcePath)) {
            return sourcePathOut;
        }
        sourcePathOut = mrxsTransToImage(sourcePathOut, destPath);
        return sourcePathOut;
        /*
        try {
            System.gc();  //调用gc回归流
            FileUtils.deleteDirectory(new File(unzipDir));
        }
        catch (Exception e) {
            //LOG.error("Unable to delete unzip directory " + unzipDir + " error = " + e.toString());
            LOG.error("Unable to delete unzip directory " + unzipDir + " error = " + e.toString());
        }
         */
    }
    private static String mrxsZipToFile(String sourcePath, String folderPath) {
        if (!DBBasedConfigs.isImageUploadAllowed()) {
            throw new WebApplicationException("Please upload a txt file containing only URLs in each line.", Response.Status.BAD_REQUEST);
        }
        //unzipDir = UploadFileUtil.getRandomUploadPath(null);
        String filePathOut = null;
        boolean isMrxs = false;
        try {
            File destDir = new File(folderPath);   //unzipDir
            /*
            if (!destDir.exists()) {
                destDir.mkdir();
            }
             */
            try {
                ZipInputStream zipIn = new ZipInputStream(new FileInputStream(sourcePath), StandardCharsets.UTF_8);
                ZipEntry entry = zipIn.getNextEntry();
                // iterates over entries in the zip file
                while (entry != null) {
                    if(entry.isDirectory()) {
                        String fileName = entry.getName().split("/")[0];
                        String filePath = folderPath + "/" + fileName;  //unzipDir
                        File dir = new File(filePath);
                        dir.mkdir();
                    }
                    if(entry.getName().split("\\.")[entry.getName().split("\\.").length - 1].equals("mrxs")) {
                        isMrxs = true;
                    }
                    zipIn.closeEntry();
                    entry = zipIn.getNextEntry();
                }
                if(!isMrxs) {
                    filePathOut = sourcePath;
                    return filePathOut;
                }
                zipIn.close();
                ZipInputStream zipNextIn = new ZipInputStream(new FileInputStream(sourcePath), StandardCharsets.UTF_8);
                ZipEntry entryNext = zipNextIn.getNextEntry();
                while (entryNext != null) {
                    if(!entryNext.isDirectory()) {
                        try {
                            String fileName = entryNext.getName();
                            String filePath = folderPath + "/" + fileName;  //unzipDir
                            if(filePath.split("\\.")[filePath.split("\\.").length - 1].equals("mrxs")) {
                                filePathOut = filePath;
                            }
                            // if the entry is a file, extracts it
                            extractFile(zipNextIn, filePath);
                            zipNextIn.closeEntry();
                        } catch (Exception e) {
                            LOG.error("Error extracting zip item from file " + sourcePath + " Error = " + e.toString());
                        }
                    }
                    entryNext = zipNextIn.getNextEntry();
                }
                zipNextIn.close();
            }
            catch (Exception e) {
                e.printStackTrace();
                LOG.error("Unable to extract the zip file " + sourcePath +  " Error = " + e.toString());
                throw new WebApplicationException("Unable to extract the zip file ", Response.Status.BAD_REQUEST);
            }
        } catch(Exception e) {

        }
        return filePathOut;
    }

    private static void extractFile(ZipInputStream zipIn, String filePath) throws IOException {
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(filePath));
        byte[] bytesIn = new byte[BUFFER_SIZE];
        int read = 0;
        while ((read = zipIn.read(bytesIn)) != -1) {
            bos.write(bytesIn, 0, read);
        }
        bos.close();
    }

    private static String mrxsTransToImage(String filePath, String destPath) {
        String outPath = null;
        try{
            String[] parts = filePath.split("/");
            if(parts[parts.length - 1].split("\\.")[1].equals("mrxs"))
                outPath =  destPath + '/' + parts[parts.length - 1].split("\\.")[0] + ".mrxs.png";
            else
                outPath = destPath + '/' + parts[parts.length - 1].split("\\.")[0] + ".png";
            File file = new File(filePath);
            OpenSlide os = new OpenSlide(file);
            BufferedImage img = os.createThumbnailImage(0,0,os.getLevel0Width(), os.getLevel0Height(),3000,BufferedImage.TYPE_INT_ARGB);
            OutputStream ops = new FileOutputStream(new File(outPath));
            ImageIO.write(img, "png", ops);
            os.close();
            ops.close();
        } catch(Exception e) {
            LOG.error("Error "+ e.toString() + " " + CommonUtils.getStackTraceString(e));
        }
        return outPath;
    }
}
