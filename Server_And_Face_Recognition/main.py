import cv2
from simple_facerec import SimpleFacerec
from datetime import datetime
from datetime import date
import os
import csv


def yoklamayaYaz(ad):
    dosya_yolu = "csvs/yoklama_listesi.csv"

    # Dosya var mı kontrolü
    dosya_var_mi = os.path.exists(dosya_yolu)

    # Tarih ve saat bilgileri alınır
    saat = datetime.now().strftime("%H:%M:%S")
    tarih = datetime.now().date()

    # Dosyaya yazma işlemi
    with open(dosya_yolu, mode='a', newline='') as dosya:
        yazici = csv.writer(dosya)

        # Dosya yoksa veya boşsa başlık satırını ekler
        if not dosya_var_mi or os.path.getsize(dosya_yolu) == 0:
            yazici.writerow(["Ad", "Tarih", "Saat"])

        # Dosyadaki öğrenciler kontrol edilir
        with open(dosya_yolu, mode='r') as okuma_dosyasi:
            okuyucu = csv.reader(okuma_dosyasi)
            ogrenci_listesi = [satir[0] for satir in okuyucu]

            # Eğer öğrenci listede yoksa, dosyaya ekler
            if ad not in ogrenci_listesi:
                yazici.writerow([ad, tarih, saat])

 
# Encode faces from a folder
sfr = SimpleFacerec()
sfr.load_encoding_images("images/")

# Load Camera
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    # Detect Faces
    face_locations, face_names = sfr.detect_known_faces(frame)
    for face_loc, name in zip(face_locations, face_names):
        y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]

        cv2.putText(frame, name,(x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

        yoklamayaYaz(name)

    cv2.imshow("Frame", frame)

    key = cv2.waitKey(1)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()