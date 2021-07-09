package dataturks;

import bonsai.Constants;
import bonsai.Utils.ThumbnailUtil;
import bonsai.config.DBBasedConfigs;
import bonsai.dropwizard.dao.d.DProjects;
import dataturks.aws.S3Handler;

import javax.ws.rs.WebApplicationException;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;


public class DataStorageHandler {

    public static List<String> uploadAndGetURLs(List<String> files, DProjects project) {
        if (DUtils.isOnPremMode()) {
            return uploadAndGetURLsLocal(files, project);
        }
        return S3Handler.uploadAndGetURLs(files, project);
    }

    public static String uploadAndGetURL(String filepath, DProjects project) {
        if (DUtils.isOnPremMode()) {
            return uploadAndGetURLLocal(filepath, project);
        }

        return S3Handler.uploadAndGetURL(filepath, project);
    }

    private static List<String> uploadAndGetURLsLocal(List<String> files, DProjects project) {
        List<String> urls = new ArrayList<>();
        for (String file : files) {
            String url = uploadAndGetURLLocal(file, project);
            if (url != null) {
                urls.add(url);
            }
        }
        return urls;
    }

    public static String uploadAndGetURLLocal(String filePath, DProjects project) {
        try {
            //form new path.
            String folderName = project.getId();
            // storagePath是/home/dataturks/bazaar/uploads
            String storagePath = Constants.DEFAULT_FILE_STORAGE_DIR;
            Path folderPath = Paths.get(storagePath, folderName);
            String fileName = DUtils.createUniqueFileName(filePath);// 生成大图文件名
            Path newFilePath = folderPath.resolve(fileName);// 生成大图对应的路径
            Path thumbnailFilePath = ThumbnailUtil.getThumbnailFilePath(folderPath, fileName);// 生成缩略图路径
            File directory = new File(folderPath.toString());
            if (!directory.exists()) {
                directory.mkdirs();
            }

            Path oldFilePath = Paths.get(filePath);
            Files.copy(oldFilePath, newFilePath, StandardCopyOption.REPLACE_EXISTING);

            // 为图片生成缩略图，也就是标注页面左上角的小地图
            ThumbnailUtil.copyThumbnail(newFilePath, thumbnailFilePath);

            //url like "/uploads/sdkjfhfh7768gjgjjh/98856jjhhn___playing.jpg"
//            return "/" + folderPath.getParent().getFileName() + "/" + folderPath.getFileName() + "/" + newFilePath.getFileName();
            return "/" + folderPath.getParent().getFileName() + "/" + folderPath.getFileName() + "/" + thumbnailFilePath.getFileName();
        }
        catch (Exception e) {
            throw new WebApplicationException("Error storing file locally, either the disk is full or some other error occured.");
        }
    }

}
