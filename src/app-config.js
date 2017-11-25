import { getServerURL } from 'kit/lib/env'
import path from 'path'

const serverUrl = getServerURL()

export default {
  sequelize: { //connect database settings
    username: 'root', //MySql Username
    password: '', //MySql Password
    dbname: 'reactql_db', //ชื่อฐานข้อมูล
    options: {
      host: 'localhost', //Mysql Host
      port: 3306, //MySql Port
      dialect: 'mysql', //ชนิดของโปรแกรมฐานข้อมูล
      operatorsAliases: false, // ไม่ใช้ $ ใน condition เพื่อความปลอดภัย
      define: {
        freezeTableName: true, //เพื่อไม่ให้ sequelize เติม s หลังชื่อตาราง
        timestamps: false, //ให้ค่า default ของตารางไม่มีฟิลด์ createdAt, updatedAt
        underscored : true, //ให้ค่า default ของชื่อฟิลด์อัตโนมัติเป็น Underscores (เดิมเป็น Camel Case)
      },
      // logging: false, //ปิดการแสดง log ตอน query ตาราง
    },
  },
  token: {
    name: 'reactQLJWT',
    secret: 'Change Me Please',
    rounds: 10,
  },
  oauth2: {
    google: {
      clientID: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_SECRET_ID',
    }
  },
  upload: {
    enpointUrl: `${serverUrl}/upload`,
    unlinkUrl: `${serverUrl}/unlink`,
    autoCreateDir: true,
    baseDir: path.join(__dirname, process.env.NODE_ENV === 'development' ? 'dev' : 'public', 'uploads'),
    // baseUrl: `${serverUrl}/uploads`,
    // baseUrl: (SERVER ? '' : serverUrl) + '/uploads',
    baseUrl: (!process.env.NODE_ENV === 'development' && SERVER ? '' : serverUrl) + '/uploads',
    // baseUrl: serverUrl + (process.env.NODE_ENV === 'development' ? '/dev' : '/public') + '/uploads',
    csrf: 'any secret key to upload'
  },
  modules: {
    user: {
      link: '/user',
      // auth: {
      //   loginBy: 'ldap', //db or ldap
      //   ldap: {
      //     server: ['dc2.psu.ac.th','dc7.psu.ac.th','dc1.psu.ac.th'],
      //     basedn: 'dc=psu,dc=ac,dc=th',
      //     domain: 'psu.ac.th',
      //   },
      // },
      upload: {
        path: 'user',
      },
      avatar: {
        path: 'avatars',
        aspectRatio: 1,
        size: {
          width: 300,
          height: 300,
        }
      },
      cover: {
        path: 'covers',
        aspectRatio: 16 / 6,
        size: {
          width: 1024,
          height: 383,
        }
      },
    }
  }
 }
 