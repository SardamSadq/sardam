using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace QistyarLauncher {
    static class Program {
        [STAThread]
        static void Main() {
            try {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string nodePath = Path.Combine(baseDir, "node.exe");
                if (!File.Exists(nodePath)) {
                    nodePath = "node";
                }
                
                string serverPath = Path.Combine(baseDir, "server.cjs");
                if (!File.Exists(serverPath)) {
                    serverPath = Path.Combine(baseDir, "bundle.cjs");
                }

                ProcessStartInfo startInfo = new ProcessStartInfo {
                    FileName = nodePath,
                    Arguments = "\"" + serverPath + "\" --open",
                    WorkingDirectory = baseDir,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                startInfo.EnvironmentVariables["IS_DESKTOP_EXE"] = "true";
                startInfo.EnvironmentVariables["OPEN_BROWSER"] = "true";

                Process.Start(startInfo);
            } catch (Exception ex) {
                MessageBox.Show("Error starting QISTYAR:\n" + ex.Message, "QISTYAR Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
