### First install wamp server in your windows machine. and enable following modules for apache:

```bash
mod_lbmethod_byrequests
mod_proxy_connect
mod_proxy_http
mod_proxy
mod_headers
mod_env
mod_deflate
mod_ssl
```

### After that add the following entries in your windows host file:

```bash
127.0.0.1	educ.asm
::1	educ.asm

127.0.0.1	admin.educ.asm
::1	admin.educ.asm

127.0.0.1	learner.educ.asm
::1	learner.educ.asm



### After that add the following entries in your apache virtual host file:

```bash
<VirtualHost *:80>
	ServerAdmin educ@mydomain.com
	ServerName admin.educ.asm

	UseCanonicalName on
	ProxyPreserveHost On
	ProxyRequests Off

	<Proxy *>
		Order allow,deny
		Allow from all
	</Proxy>

	ProxyPass / http://localhost:3000/
	ProxyPassReverse / http://localhost:3000/

	Header set Access-Control-Allow-Origin "*"

</VirtualHost>


```
