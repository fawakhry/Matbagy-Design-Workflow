# Google Drive Project Structure — صندوق مطبعجي

> القاعدة الرسمية: يظهر في My Drive فولدر رئيسي واحد فقط خاص بالمشروع، وكل حالات وتصميمات مطبعجي تكون داخله.

## Project Root

- name: `مشروع مطبعجي - Matbagy Project`
- folder_id: `1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`
- url: `https://drive.google.com/drive/folders/1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`
- parent: `My Drive root`

## Direct children

### 01_Design_Cases
- folder_id: `1qhoxC_c2MF3X_hhHcWiDo2SzW2ySCch_`
- url: `https://drive.google.com/drive/folders/1qhoxC_c2MF3X_hhHcWiDo2SzW2ySCch_`
- note: هذا هو نفس Folder ID القديم لـ`صندوق مطبعجي - الصور` بعد نقله تحت Project Root وإعادة تسميته، لذلك كل الـIDs والروابط الداخلية القديمة ظلت صالحة.

### 02_Orders
- folder_id: `19vhyOha215dLr5_pxv8BdZy_-sq7LgDm`
- url: `https://drive.google.com/drive/folders/19vhyOha215dLr5_pxv8BdZy_-sq7LgDm`

### 03_Shared_Assets
- folder_id: `1cBMs21DKCuTPzcfmkj2UjgFfHdqQGVgl`
- url: `https://drive.google.com/drive/folders/1cBMs21DKCuTPzcfmkj2UjgFfHdqQGVgl`

### 04_Archive
- folder_id: `1kke5hm_Bsq1Q_XHEuTpOkTTRkjpMEz5K`
- url: `https://drive.google.com/drive/folders/1kke5hm_Bsq1Q_XHEuTpOkTTRkjpMEz5K`

### 05_System
- folder_id: `14amOaEUH4kGP4iFWTlMDfZ1c3c9edMH7`
- url: `https://drive.google.com/drive/folders/14amOaEUH4kGP4iFWTlMDfZ1c3c9edMH7`

## Canonical Case path

`My Drive/مشروع مطبعجي - Matbagy Project/01_Design_Cases/YYYY/<CASE_ID>/`

## Existing migrated case

### DESIGN-2026-000001
- year_folder_id: `1AP68g1gP0S3fNNzgyOkithg3VfH4kEgE`
- year_folder_url: `https://drive.google.com/drive/folders/1AP68g1gP0S3fNNzgyOkithg3VfH4kEgE`
- case_folder_id: `1uA9k8SLnq0s21C4K79-SlkDE2U8qXQrj`
- case_folder_url: `https://drive.google.com/drive/folders/1uA9k8SLnq0s21C4K79-SlkDE2U8qXQrj`
- asset_id: `DESIGN-2026-000001-A001`
- drive_file_id: `1srMthjL-cR0cdk7VOOkMZjrEmUCWwFS-`
- file_name: `DESIGN-2026-000001-A001.png`
- file_url: `https://drive.google.com/file/d/1srMthjL-cR0cdk7VOOkMZjrEmUCWwFS-/view`
- asset_binding_status: `LINKED`

## Rules

1. لا تنشئ Case أو Asset في My Drive root مباشرة.
2. كل Design Case جديدة تذهب تحت `01_Design_Cases/YYYY/<CASE_ID>/`.
3. لا ننقل أو ننسخ Asset موجود إذا كان تغيير الـParent كافيًا؛ الحفاظ على Drive File ID له أولوية.
4. `Drive File ID` و`Folder ID` هما المرجع الأقوى، وليس اسم المسار وحده.
5. أي تغيير مستقبلي في التنظيم يجب أن يحافظ على IDs قدر الإمكان، ثم يحدث هذا الملف وCase metadata.
6. صور العملاء لا تذهب إلى GitHub؛ GitHub يحفظ IDs والروابط والmetadata فقط.
