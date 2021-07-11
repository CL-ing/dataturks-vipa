package bonsai.Utils.ImageTransHandler;

import bonsai.Constants;
import bonsai.Utils.ThumbnailUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImageTransUtil {
    private static final Logger LOG = LoggerFactory.getLogger(ThumbnailUtil.class);
    public static String trans(String sourcePath, String destPath){
        try{
            Process process = Runtime.getRuntime().exec("cmd /c activate dataturks-py36&&python " + Constants.trans_Py_Locate + " " + sourcePath + " " + destPath);
            int result = process.waitFor();
            if(result != 0) {
                LOG.error("Unable to Transform the medical image");
            }
            String[] parts = sourcePath.split("/");
            if(parts[parts.length - 1].split("\\.")[1].equals("mrxs"))
                return destPath + '/' + parts[parts.length - 1].split("\\.")[0] + ".mrxs.png";
            else
                return destPath + '/' + parts[parts.length - 1].split("\\.")[0] + ".png";
        }catch (Exception e){
            return null;     // return非0代表trans函数异常;
        }
    }
}