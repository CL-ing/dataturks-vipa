package bonsai.Utils.ImageTransHandler;


import org.openslide.OpenSlide;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;

public class Test {
    private static boolean GenerateImage(String imgStr)
    {   //对字节数组字符串进行Base64解码并生成图片
        if (imgStr == null) //图像数据为空
            return false;
        BASE64Decoder decoder = new BASE64Decoder();
        try
        {
            //Base64解码
            byte[] b = decoder.decodeBuffer(imgStr);
            for(int i=0;i<b.length;++i)
            {
                if(b[i]<0)
                {//调整异常数据
                    b[i]+=256;
                }
            }
            //生成jpeg图片
            String imgFilePath = "D:\\gitdemo\\image_transform\\out\\test.jpg";//新生成的图片
            OutputStream out = new FileOutputStream(imgFilePath);
            out.write(b);
            out.flush();
            out.close();
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }
    private static String getMrxsBase64Str(String imgUrl) {
        InputStream inputStream = null;
        byte[] data = null;
        try {
            inputStream = new FileInputStream(imgUrl);
            data = new byte[inputStream.available()];
            inputStream.read(data);
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data);
    }
    public static void main(String[] args) {
        try{

            String fileName = "D:\\gitdemo\\dataturks-vipa-refactoring-3\\client\\public\\uploads\\2c91e6917a801ed0017a8022c4b20000/5af3c113-1ad3-46a3-a54d-abb7cc5a3a03___CMU-1-Saved-1_16.mrxs";
            File file = new File(fileName);
            OpenSlide os = new OpenSlide(file);
            BufferedImage img = os.createThumbnailImage(0,0,os.getLevel0Width(), os.getLevel0Height(),3000,BufferedImage.TYPE_INT_ARGB);
            OutputStream ops = new FileOutputStream(new File("D:\\gitdemo\\image_transform\\out\\a.png"));
            ImageIO.write(img, "png", ops);
            os.close();
            ops.close();
            /*
            ByteArrayOutputStream outputStream = null;
            long x,y,width,height;
            long hMrxs,wMrxs;
            int hThumb,wThumb,xOut,yOut,wOut,hOut;
            String imageName = "D:\\gitdemo\\image_transform\\out\\a.png";
            BufferedImage image = ImageIO.read(new File(imageName));
            String fileName = "D:\\gitdemo\\image_transform\\mrxs\\CMU-1-Saved-1_16.mrxs";
            File file = new File(fileName);
            OpenSlide os = new OpenSlide(file);
            hMrxs = os.getLevel0Height();
            wMrxs = os.getLevel0Width();
            hThumb = image.getHeight();
            wThumb = image.getWidth();
            xOut = x / hThumb * hMrxs;
            yOut = y / wThumb * wMrxs;
            wOut = width / wThumb * wMrxs;
            hOut = height / hThumb * hMrxs;
            BufferedImage img = os.createThumbnailImage(xOut,yOut,wOut, hOut,10000,BufferedImage.TYPE_INT_ARGB);
            outputStream = new ByteArrayOutputStream();
            ImageIO.write(img, "png", outputStream);

            BASE64Encoder encoder = new BASE64Encoder();

            return encoder.encode(outputStream.toByteArray());
        */
        } catch(Exception e) {

        }


    }
}
