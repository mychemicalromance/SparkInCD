package com.dc.appengine.util;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.Session;

import java.io.*;

/* -*-mode:java; c-basic-offset:2; indent-tabs-mode:nil -*- */

/**
 * This program will demonstrate the file transfer from local to remote.
 * $ CLASSPATH=.:../build javac ScpTo.java
 * $ CLASSPATH=.:../build java ScpTo file1 user@remotehost:file2
 * You will be asked passwd.
 * If everything works fine, a local file 'file1' will copied to
 * 'file2' on 'remotehost'.
 */

public class ScpTo {

    //执行一个短命令，返回一个字符串
    public static String execShortCommand(Session session, String command) {
        ChannelExec channel = null;
        try {
            channel = (ChannelExec) session.openChannel("exec");
            channel.setCommand(command);
            final InputStream out = channel.getInputStream();
            final InputStream err = channel.getErrStream();
            final StringBuffer buffer = new StringBuffer();
            channel.connect();
            Runnable r1 = new Runnable() {
                @Override
                public void run() {
                    try (BufferedReader br = new BufferedReader(new InputStreamReader(out))) {
                        String str = null;
                        while ((str = br.readLine()) != null) {
                            buffer.append(str);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

            };
            Runnable r2 = new Runnable() {
                @Override
                public void run() {
                    try (BufferedReader br = new BufferedReader(new InputStreamReader(err))) {
                        String str = null;
                        while ((str = br.readLine()) != null) {
                            buffer.append(str);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            };
            Thread t1 = new Thread(r1);
            Thread t2 = new Thread(r2);
            t1.start();
            t2.start();
            t1.join();
            t2.join();
            return buffer.toString();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (channel != null) {
                channel.disconnect();
            }
        }
        return "error";
    }

    //拷贝文件
    public static boolean scpTo(Session session, String file1, String file2) {
        FileInputStream fis = null;
        Channel channel = null;
        try {
            String lfile = file1;
            String rfile = file2;
            boolean ptimestamp = true;
            String command = "scp " + (ptimestamp ? "-p" : "") + " -t " + rfile;
            channel = session.openChannel("exec");
            ((ChannelExec) channel).setCommand(command);
            // get I/O streams for remote scp
            OutputStream out = channel.getOutputStream();
            InputStream in = channel.getInputStream();
            channel.connect();
            if (checkAck(in) != 0) {
                return false;
            }
            File _lfile = new File(lfile);
            if (ptimestamp) {
                command = "T" + (_lfile.lastModified() / 1000) + " 0";
                // The access time should be sent here,
                // but it is not accessible with JavaAPI ;-<
                command += (" " + (_lfile.lastModified() / 1000) + " 0\n");
                out.write(command.getBytes());
                out.flush();
                if (checkAck(in) != 0) {
                    return false;
                }
            }
            // send "C0644 filesize filename", where filename should not include
            // '/'
            long filesize = _lfile.length();
            command = "C0644 " + filesize + " ";
            if (lfile.lastIndexOf('/') > 0) {
                command += lfile.substring(lfile.lastIndexOf('/') + 1);
            } else {
                command += lfile;
            }
            command += "\n";
            out.write(command.getBytes());
            out.flush();
            if (checkAck(in) != 0) {
                return false;
            }
            // send a content of lfile
            fis = new FileInputStream(lfile);
            byte[] buf = new byte[1024];
            while (true) {
                int len = fis.read(buf, 0, buf.length);
                if (len <= 0)
                    break;
                out.write(buf, 0, len); // out.flush();
            }
            fis.close();
            fis = null;
            // send '\0'
            buf[0] = 0;
            out.write(buf, 0, 1);
            out.flush();
            if (checkAck(in) != 0) {
                return false;
            }
            out.close();
            channel.disconnect();
            return true;
        } catch (Exception e) {
            System.out.println(e);
            try {
                if (fis != null)
                    fis.close();
            } catch (Exception ee) {
            }
            return false;
        } finally {
            if(channel!=null){
                channel.disconnect();
            }
        }
    }

    static int checkAck(InputStream in) throws IOException {
        int b = in.read();
        // b may be 0 for success,
        // 1 for error,
        // 2 for fatal error,
        // -1
        if (b == 0)
            return b;
        if (b == -1)
            return b;

        if (b == 1 || b == 2) {
            StringBuffer sb = new StringBuffer();
            int c;
            do {
                c = in.read();
                sb.append((char) c);
            } while (c != '\n');
            if (b == 1) { // error
                System.out.print(sb.toString());
            }
            if (b == 2) { // fatal error
                System.out.print(sb.toString());
            }
        }
        return b;
    }
}
