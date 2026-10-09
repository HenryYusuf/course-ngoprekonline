#!/usr/bin/env bash
# Setup awal VPS: user deploy, SSH key, dan firewall dasar.
# Jalankan sebagai root sekali, setelah login pertama via password.
#
# Pakai:
#   ./setup-vps.sh <ip-vps> <nama-user-deploy>
#
# Contoh:
#   ./setup-vps.sh 203.0.113.10 deploy
set -euo pipefail

IP="${1:?isi ip vps}"
USER_DEPLOY="${2:?isi nama user deploy}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519.pub}"

if [[ ! -f "$SSH_KEY" ]]; then
  echo "SSH key tidak ditemukan: $SSH_KEY" >&2
  exit 1
fi

echo "==> Membuat user $USER_DEPLOY"
adduser --disabled-password --gecos "" "$USER_DEPLOY"
usermod -aG sudo "$USER_DEPLOY"

echo "==> Memasang SSH key"
mkdir -p "/home/$USER_DEPLOY/.ssh"
cp "$SSH_KEY" "/home/$USER_DEPLOY/.ssh/authorized_keys"
chown -R "$USER_DEPLOY:$USER_DEPLOY" "/home/$USER_DEPLOY/.ssh"
chmod 700 "/home/$USER_DEPLOY/.ssh"
chmod 600 "/home/$USER_DEPLOY/.ssh/authorized_keys"

echo "==> Mengaktifkan UFW (SSH, HTTP, HTTPS)"
apt-get install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> Selesai. Uji login baru sebelum menonaktifkan password auth:"
echo "    ssh $USER_DEPLOY@$IP"
