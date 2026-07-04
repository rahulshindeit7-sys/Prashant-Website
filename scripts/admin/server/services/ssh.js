const { NodeSSH } = require('node-ssh');
const credentialService = require('./credentials');

async function getSSHConnection(site) {
  const ssh = new NodeSSH();
  const config = {
    host: site.ssh_host,
    port: site.ssh_port,
    username: site.ssh_user
  };

  if (site.auth_method === 'key') {
    config.privateKeyPath = site.ssh_key_path;
  } else {
    const password = await credentialService.getPassword(site.site_id);
    if (!password) {
      throw new Error('No stored password found for this site');
    }
    config.password = password;
  }

  await ssh.connect(config);
  return ssh;
}

async function testConnection(site) {
  let ssh;
  try {
    ssh = await getSSHConnection(site);
    return { reachable: true, message: 'Connected successfully' };
  } catch (err) {
    return { reachable: false, message: err.message };
  } finally {
    if (ssh) ssh.dispose();
  }
}

async function pushFile(site, localContent, remotePath) {
  let ssh;
  try {
    ssh = await getSSHConnection(site);
    // Write content to remote file via stdin
    const result = await ssh.execCommand(`cat > "${remotePath}"`, {
      stdin: localContent
    });
    if (result.stderr && result.code !== 0) {
      throw new Error(`Push failed: ${result.stderr}`);
    }
    return { success: true, message: 'File pushed successfully' };
  } finally {
    if (ssh) ssh.dispose();
  }
}

async function pullFile(site, remotePath) {
  let ssh;
  try {
    ssh = await getSSHConnection(site);
    const result = await ssh.execCommand(`cat "${remotePath}"`);
    if (result.code !== 0) {
      throw new Error(`Pull failed: ${result.stderr}`);
    }
    return { success: true, content: result.stdout };
  } finally {
    if (ssh) ssh.dispose();
  }
}

module.exports = {
  testConnection,
  pushFile,
  pullFile
};
