# wheel_practice

## Motivation
스팍스가 운영하는 서비스들의 status를 저장하고, 이를 알려줄 수 있는 기능과
이러한 이슈들과 공지들을 저장할 수 있는 게시판을 구현하고
slack이나 sns를 통해 에러가 났음을 알릴 수 있는 페이지를 구현하고자 하였다.

## Structure of Application

```bash

┌ config
│   └ config.json
├ models
│    ├ index.js
│    ├ Post.js
│    └ Status.js
├ routes
│    ├ auth.js
│    ├ post.js
│    └ status.js
├ index.js
└ schedule.js

```

## 기술 스택

### Database: MySql
### Server: Node JS
### Deployment: AWS EC2

## Model 설명

### Post

이슈와 공지와 관련된 게시글을 저장하기 위한 테이블이다.

attribute:
- id(primary key)
- title(string)
- content(string)
- service(string) 
- createdAt(datetime)
- updatedAt(datetime)

### Status

최근 스파스 서비스 ["newara", "otl", "sso", "geoul", "home", "zabo", "kono", "random"] 와 관련된
가장 최근 status를 저장한다.


attribute:
- id(primary key)
- operational(tinyint)
- service(string) 
- createdAt(datetime)
- updatedAt(datetime)


## schedule.js
index.js에서는 schedule.js에 있는 check_status 와 send_message를 실행시킨다.

- check_status
\
백그라운드에서 setInterval 함수에 의해 일정 기간동안 서비스들의 작동 여부를 확인하고
이를 db의 status 테이블의 값들을 update하는 방식으로 저장한다.

- send_message
\
send_message같은 경우 check_status 보다 긴 주기로 실행되며, 해당 주기동안
각 서비스마다 에러가 몇 번 발생했는지 slack에 공지하는 역할을 담당한다.


## Routes 설명

### auth
- auth/login
\
스파스 memvers username, password를 입력하면 LDAP을 이용하여 입력값이 유효한지 확인한 후
express-session을 이용하여 사용자에게 쿠키를 저장하는 동시에, sid를 서버에 저장한다.

- auth/loginstatus
\
지금 브라우저 사용자의 쿠키를 이용하여
로그인 상태인지 boolean 값을 반환한다.

- auth/logout
\
사용자가 가진 세션 정보를 지우는 기능을 담당한다.

### post 
- post
- post/:id
- post/service
\
게시글과 관련된 정보를 post 테이블을 이용하여 CRUD 기능을 제공한다.


### status
- status/info
\
db에 저장되어 있는 최근 status를 가져와서 SSE(server sent event)을 이용하여 일정 주기로
스팍스 서버스 마다의 status를 알려준다.

## Api Documentation
https://docs.google.com/spreadsheets/d/14Der3SEK0L7gYDDerdz_oBK5X8NbSccWFyZX5mC9rzo/edit#gid=0


## Install and Deploy
```code

git clone https://github.com/seungkukim/wheel_practice.git
cd wheel_practice
npm install
pm2 start index.js

```

## 추후에 할 일
현재 서비스들의 status는 update를 통해 가장 최근 값들과 측정 시각을 기록하고 있다.
Redis와 같이 Entry 마다 일정 기간 후 expire하게 할 수 있다면 \
관리자가 정한 기간 동안의 status들을 저장하여 이와 관련된 통계를 제공할 수 있을 것이다.
