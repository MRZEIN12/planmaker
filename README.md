# PlanMaker

A simple planning app. Create a plan, add tasks, and check them off. Progress updates from the tasks you finish.

The interface is React (Vite). The server is Laravel. Data is stored in MySQL. On this PC that database is the MariaDB server that comes with XAMPP, which speaks MySQL.

XAMPP’s own PHP is 7.4, which cannot run this Laravel version. The app uses PHP 8.3 installed at `C:\php83`.

## Requirements

- PHP 8.3 with `curl`, `fileinfo`, `mbstring`, `openssl`, `pdo_mysql`, and `zip`
- Composer
- Node.js 22 or newer
- MySQL or MariaDB

## Setup on this PC

1. Start MySQL from the XAMPP control panel if it is not already running.
2. Create the database if it does not exist:

```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS planmaker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

3. From `C:\Users\MYCOM\PlanMaker`:

```powershell
$env:Path = "C:\php83;" + $env:Path
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
php artisan serve
```

4. Open http://127.0.0.1:8000 and create an account.

`.env` should point at the database:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=planmaker
DB_USERNAME=root
DB_PASSWORD=
```

Leave the password empty only for the local XAMPP root account. Set a real password before you put this on a server.

## Password reset without email

`MAIL_MAILER=log` writes mail to `storage/logs/laravel.log`. While `APP_ENV=local`, the forgot-password page also shows the reset link so you can finish the flow on this computer.

## Tests

```powershell
$env:Path = "C:\php83;" + $env:Path
php artisan test
```

Tests use an in-memory SQLite database and do not touch `planmaker`.

## What you can do

- Register, sign in, sign out, and reset a password
- Create a plan from scratch or from a template
- Add, edit, complete, reopen, and delete tasks
- See progress, today’s tasks, and upcoming or overdue tasks
- Search and filter plans, then edit, duplicate, or delete them
- Update your name, email, password, theme, and reminder preference
- Delete your account

Each person only sees their own plans and tasks.
