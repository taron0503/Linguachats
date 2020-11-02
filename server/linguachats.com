server {
    listen 80;
    #listen [::]:80;

    #root /var/www/linguachats.com/html;

    #index index.html;

    server_name linguachats.com www.linguachats.com;
    if ($scheme = http) {
      return 301 https://$host$request_uri;
    }
    #return 301 https://server_name$request_uri;

    access_log /var/log/nginx/linguachats.com.access.log;
    error_log /var/log/nginx/linguachats.com.error.log;

    location / {
        #try_files $uri $uri/ =404;
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/linguachats.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/linguachats.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
