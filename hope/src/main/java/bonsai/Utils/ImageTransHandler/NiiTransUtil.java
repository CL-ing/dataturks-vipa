package bonsai.Utils.ImageTransHandler;

import bonsai.Constants;
import bonsai.Utils.ThumbnailUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class NiiTransUtil {
    private static final Logger LOG = LoggerFactory.getLogger(ThumbnailUtil.class);
    public static List<String> trans(String sourcePath, String destPath){
        try{
            Process process = Runtime.getRuntime().exec("cmd /c activate dataturks-py36&&python " + Constants.trans_Py_Locate + " " + sourcePath + " " + destPath);
            int result = process.waitFor();
            if(result != 0) {
                LOG.error("Unable to Transform the medical image");
            }
            List<String> niiLists = new ArrayList<>();
            String[] parts = sourcePath.split("/");
            niiLists.add(destPath + "/" + parts[parts.length - 1].split("\\.")[0] + "-1.png");
            niiLists.add(destPath + "/" + parts[parts.length - 1].split("\\.")[0] + "-2.png");
            niiLists.add(destPath + "/" + parts[parts.length - 1].split("\\.")[0] + "-3.png");
            return niiLists;
        }catch (Exception e){
            return null;     // return非0代表trans函数异常;
        }
    }
}
