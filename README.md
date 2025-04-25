# المكتبة التاريخية الرقمية - Historical Digital Library

موقع مكتبة رقمية للوثائق التاريخية مع نظام إدارة محتوى مدعوم بـ PocketBase.

## متطلبات النظام

- Node.js (v14 أو أحدث)
- NPM (v6 أو أحدث)
- PocketBase (v0.26 أو أحدث)

## الإعداد

### 1. إعداد الموقع

1. استنساخ هذا المشروع إلى جهازك المحلي:
```bash
git clone <repository-url>
cd digital-library
```

2. تثبيت التبعيات:
```bash
npm install
```

### 2. إعداد PocketBase

1. قم بتنزيل أحدث إصدار من PocketBase من [الموقع الرسمي](https://pocketbase.io/docs/).
2. استخرج الملف وانتقل إلى مجلد PocketBase.
3. قم بتشغيل الخادم:
```bash
./pocketbase serve
```
4. انتقل إلى `http://127.0.0.1:8090/_/` للوصول إلى لوحة تحكم PocketBase.
5. قم بإنشاء حساب مسؤول جديد.

### 3. إنشاء المجموعات والحقول

بعد تسجيل الدخول إلى لوحة تحكم PocketBase، اتبع الخطوات التالية لإنشاء مجموعات البيانات:

#### مجموعة الفئات (categories)

1. انتقل إلى قسم "Collections" وانقر على "New collection"
2. أدخل اسم المجموعة: `categories`
3. انقر على "Create"
4. أضف الحقول التالية:

| اسم الحقل (Field name) | نوع الحقل (Type) | الخيارات (Options) |
|------------------------|------------------|-------------------|
| name | Text | Required |
| description | Text | - |
| icon | Text | - |

#### مجموعة المنشورات (posts)

1. انتقل إلى قسم "Collections" وانقر على "New collection"
2. أدخل اسم المجموعة: `posts`
3. انقر على "Create"
4. أضف الحقول التالية:

| اسم الحقل (Field name) | نوع الحقل (Type) | الخيارات (Options) |
|------------------------|------------------|-------------------|
| title | Text | Required |
| content | Editor | Required |
| summary | Text | - |
| image | File | MIME types: image/jpeg, image/png, image/webp, image/gif |
| category | Relation | Required, Collection: categories |
| tags | JSON | - |
| featured | Bool | Default: false |
| view_count | Number | Min: 0, Default: 0 |
| author | Relation | Required, Collection: users |

### 4. إضافة بيانات أولية

#### إضافة فئات

1. انتقل إلى مجموعة `categories` في لوحة التحكم.
2. انقر على "New record".
3. أضف بعض الفئات الافتراضية مثل:
   - العصر القديم (icon: fa-history)
   - العصر الوسيط (icon: fa-book)
   - العصر الحديث (icon: fa-scroll)
   - الفترة المعاصرة (icon: fa-landmark)

### 5. تشغيل الموقع

1. في مجلد المشروع، قم بتشغيل الخادم:
```bash
npm start
```

2. انتقل إلى `http://localhost:3000` في متصفحك.

## استخدام الموقع

1. **تسجيل حساب جديد**: انتقل إلى صفحة تسجيل الدخول وأنشئ حساباً جديداً.
2. **إنشاء محتوى**: بعد تسجيل الدخول، يمكنك إنشاء منشورات جديدة.
3. **عرض المحتوى**: يمكنك استعراض المحتوى المنشور من الصفحة الرئيسية.

## الملاحظات التقنية

- الموقع يستخدم JavaScript الأصلي (Vanilla JS) مع CSS المخصص.
- يتم استخدام PocketBase كخادم واجهة برمجة التطبيقات (API) والتخزين.
- يدعم الموقع الوضع المظلم استناداً إلى إعدادات النظام.
- الموقع متوافق تماماً مع الهواتف المحمولة واللوحيات.

## الميزات

- ✅ نظام تسجيل الدخول وإدارة المستخدمين
- ✅ نظام إنشاء المنشورات مع محرر نصوص غني
- ✅ رفع الصور للمنشورات
- ✅ إضافة وسوم (tags) للمنشورات
- ✅ تصنيف المنشورات حسب الفئات
- ✅ دعم الصفحات المتعددة
- ✅ تصميم متجاوب مع جميع الأجهزة
- ✅ دعم RTL للغة العربية
- ✅ دعم الوضع المظلم

## المساهمة

نرحب بمساهماتكم! يرجى إنشاء fork للمشروع وإرسال pull request مع التغييرات المقترحة.

## نظرة عامة - Overview

هذا المشروع عبارة عن موقع ويب ثابت لمكتبة رقمية للوثائق التاريخية، مصنفة حسب العصور التاريخية والفئات المختلفة. يهدف الموقع إلى تقديم واجهة مستخدم جميلة بتصميم يشبه نظام iOS مع لمسات تصميم الذكاء الاصطناعي.

This project is a static website for a digital library of historical documents, categorized by historical eras and different categories. The website aims to provide a beautiful user interface with an iOS-like design and AI design touches.

## العصور التاريخية - Historical Eras

المكتبة تقسم الوثائق إلى أربعة عصور تاريخية:

1. العصر القديم
2. العصر الوسيط
3. العصر الحديث
4. الفترة المعاصرة

The library divides documents into four historical eras:

1. Ancient Era
2. Medieval Era
3. Modern Era
4. Contemporary Period

## التصنيفات - Categories

كل عصر تاريخي يحتوي على وثائق مصنفة كالتالي:

1. سياسياً
2. عسكرياً
3. اقتصادياً
4. اجتماعياً
5. ثقافياً ودينياً

Each historical era contains documents categorized as follows:

1. Political
2. Military
3. Economic
4. Social
5. Cultural and Religious

## محتوى الوثائق - Document Content

كل وثيقة تحتوي على:

- اسم
- وصف
- صورة
- فيديو شرح
- تعليق صوتي
- ترجمة

Each document contains:

- Name
- Description
- Image
- Explanatory video
- Audio commentary
- Translation

## التقنيات المستخدمة - Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome
- Google Fonts (Tajawal)

## كيفية التشغيل - How to Run

1. قم بتثبيت حزم Node.js:
   ```
   npm install
   ```

2. قم بتشغيل الخادم المحلي:
   ```
   npm start
   ```

3. افتح المتصفح على العنوان:
   ```
   http://localhost:3000
   ```

## التطوير المستقبلي - Future Development

- إضافة صفحات تفصيلية لكل عصر
- تنفيذ وظائف البحث
- إضافة قاعدة بيانات للوثائق
- دعم تعدد اللغات 