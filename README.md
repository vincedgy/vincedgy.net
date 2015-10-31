VinceDgy portfolio
========

:apple:

Node.js v4 with express v4
fully gulp scripted (you edit src and debug minified public)


# Installation

```
$ npm install
$ bower install
```

# Developp

- in one window launch gulp (compiles/minify the whole project)
```
$ gulp
```

# in another window launch the server (install nodemon as needed)
```
$ nodemon server.js
```

/!\ Set proxy for http et https :

```
git config --global http.proxy "http://user:password@proxy:tcp"
git config --global https.proxy "http://user:password@proxy:tcp"
git config --global color.ui true
git config --global credential.helper wincred
```

Push the master release to github : 

It will need user/password interactive entry

```
git push --progress origin master --set-upstream
git push --progress origin master:master
```

## bower :

Create .bowerrc in static and add proxy settings as well

static/.bowerrc :

```
{
    "directory": "components",
    "analytics": false,
    "proxy" : "http://user:password@proxy:tcp",
    "https-proxy": "http://user:password@proxy:tcp"
}
```

# TODO

Many thing to do in this app !