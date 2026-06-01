ALTER TABLE wilayas ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,7);
ALTER TABLE wilayas ADD COLUMN IF NOT EXISTS longitude DECIMAL(10,7);

INSERT INTO wilayas (code, name_ar, name_fr, name_en, latitude, longitude) VALUES
  (59, 'أفلو',             'Aflou',            'Aflou',            34.1074864, 2.1008486),
  (60, 'بريكة',            'Barika',           'Barika',           35.3845930, 5.2893430),
  (61, 'قصر الشلالة',       'Ksar Chellala',    'Ksar Chellala',    35.2200000, 2.3200000),
  (62, 'مسعد',             'Messaad',          'Messaad',          34.1500000, 3.5000000),
  (63, 'عين وسارة',         'Aïn Oussera',      'Aïn Oussera',      35.4500000, 2.9000000),
  (64, 'بوسعادة',           'Boussaâda',        'Boussaâda',        35.2100000, 4.1800000),
  (65, 'الأبيض سيدي الشيخ', 'El Abiodh Sidi Cheikh', 'El Abiodh Sidi Cheikh', 32.9000000, 0.5500000),
  (66, 'القنطرة',           'El Kantara',       'El Kantara',       35.2300000, 5.7000000),
  (67, 'بئر العاتر',        'Bir El Ater',      'Bir El Ater',      34.7300000, 8.0500000),
  (68, 'قصر البخاري',       'Ksar El Boukhari', 'Ksar El Boukhari', 35.8800000, 2.7500000),
  (69, 'العريشة',           'El Aricha',        'El Aricha',        34.2200000, -1.2500000)
ON CONFLICT (code) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

UPDATE wilayas SET latitude = 27.8700000, longitude = -0.2900000 WHERE code = 1;
UPDATE wilayas SET latitude = 36.1647000, longitude = 1.3317000 WHERE code = 2;
UPDATE wilayas SET latitude = 33.8000000, longitude = 2.8600000 WHERE code = 3;
UPDATE wilayas SET latitude = 35.8800000, longitude = 7.1200000 WHERE code = 4;
UPDATE wilayas SET latitude = 35.5500000, longitude = 6.1667000 WHERE code = 5;
UPDATE wilayas SET latitude = 36.7511000, longitude = 5.0642000 WHERE code = 6;
UPDATE wilayas SET latitude = 34.8500000, longitude = 5.7333000 WHERE code = 7;
UPDATE wilayas SET latitude = 31.6164000, longitude = -2.2183000 WHERE code = 8;
UPDATE wilayas SET latitude = 36.4722000, longitude = 2.8333000 WHERE code = 9;
UPDATE wilayas SET latitude = 36.3800000, longitude = 3.9000000 WHERE code = 10;
UPDATE wilayas SET latitude = 22.7800000, longitude = 5.5200000 WHERE code = 11;
UPDATE wilayas SET latitude = 35.4000000, longitude = 8.1167000 WHERE code = 12;
UPDATE wilayas SET latitude = 34.8828000, longitude = -1.3167000 WHERE code = 13;
UPDATE wilayas SET latitude = 35.3667000, longitude = 1.3167000 WHERE code = 14;
UPDATE wilayas SET latitude = 36.7169000, longitude = 4.0497000 WHERE code = 15;
UPDATE wilayas SET latitude = 36.7538000, longitude = 3.0588000 WHERE code = 16;
UPDATE wilayas SET latitude = 34.6667000, longitude = 3.2500000 WHERE code = 17;
UPDATE wilayas SET latitude = 36.8200000, longitude = 5.7700000 WHERE code = 18;
UPDATE wilayas SET latitude = 36.1900000, longitude = 5.4100000 WHERE code = 19;
UPDATE wilayas SET latitude = 34.8300000, longitude = 0.1500000 WHERE code = 20;
UPDATE wilayas SET latitude = 36.8667000, longitude = 6.9000000 WHERE code = 21;
UPDATE wilayas SET latitude = 35.2000000, longitude = -0.6333000 WHERE code = 22;
UPDATE wilayas SET latitude = 36.9000000, longitude = 7.7667000 WHERE code = 23;
UPDATE wilayas SET latitude = 36.4700000, longitude = 7.4300000 WHERE code = 24;
UPDATE wilayas SET latitude = 36.3650000, longitude = 6.6147000 WHERE code = 25;
UPDATE wilayas SET latitude = 36.2700000, longitude = 2.7500000 WHERE code = 26;
UPDATE wilayas SET latitude = 35.9300000, longitude = 0.0900000 WHERE code = 27;
UPDATE wilayas SET latitude = 35.6900000, longitude = 4.5400000 WHERE code = 28;
UPDATE wilayas SET latitude = 35.4000000, longitude = 0.1400000 WHERE code = 29;
UPDATE wilayas SET latitude = 31.9500000, longitude = 5.3167000 WHERE code = 30;
UPDATE wilayas SET latitude = 35.6969000, longitude = -0.6331000 WHERE code = 31;
UPDATE wilayas SET latitude = 33.6800000, longitude = 1.0200000 WHERE code = 32;
UPDATE wilayas SET latitude = 26.5000000, longitude = 8.4800000 WHERE code = 33;
UPDATE wilayas SET latitude = 36.0667000, longitude = 4.7667000 WHERE code = 34;
UPDATE wilayas SET latitude = 36.7700000, longitude = 3.4800000 WHERE code = 35;
UPDATE wilayas SET latitude = 36.7700000, longitude = 8.3100000 WHERE code = 36;
UPDATE wilayas SET latitude = 27.6700000, longitude = -8.1300000 WHERE code = 37;
UPDATE wilayas SET latitude = 35.6100000, longitude = 1.8100000 WHERE code = 38;
UPDATE wilayas SET latitude = 33.3700000, longitude = 6.8600000 WHERE code = 39;
UPDATE wilayas SET latitude = 35.4400000, longitude = 7.1400000 WHERE code = 40;
UPDATE wilayas SET latitude = 36.2864000, longitude = 7.9511000 WHERE code = 41;
UPDATE wilayas SET latitude = 36.5900000, longitude = 2.4500000 WHERE code = 42;
UPDATE wilayas SET latitude = 36.4500000, longitude = 6.2600000 WHERE code = 43;
UPDATE wilayas SET latitude = 36.2600000, longitude = 1.9700000 WHERE code = 44;
UPDATE wilayas SET latitude = 33.2700000, longitude = -0.3100000 WHERE code = 45;
UPDATE wilayas SET latitude = 35.3000000, longitude = -1.1400000 WHERE code = 46;
UPDATE wilayas SET latitude = 32.4900000, longitude = 3.6700000 WHERE code = 47;
UPDATE wilayas SET latitude = 35.7400000, longitude = 0.5600000 WHERE code = 48;
UPDATE wilayas SET latitude = 29.2600000, longitude = 0.2300000 WHERE code = 49;
UPDATE wilayas SET latitude = 21.3300000, longitude = 0.9500000 WHERE code = 50;
UPDATE wilayas SET latitude = 34.4300000, longitude = 5.0700000 WHERE code = 51;
UPDATE wilayas SET latitude = 30.0800000, longitude = -2.1000000 WHERE code = 52;
UPDATE wilayas SET latitude = 27.2000000, longitude = 2.4700000 WHERE code = 53;
UPDATE wilayas SET latitude = 19.5700000, longitude = 5.7700000 WHERE code = 54;
UPDATE wilayas SET latitude = 33.1000000, longitude = 6.0700000 WHERE code = 55;
UPDATE wilayas SET latitude = 24.5500000, longitude = 9.4800000 WHERE code = 56;
UPDATE wilayas SET latitude = 33.9500000, longitude = 5.9200000 WHERE code = 57;
UPDATE wilayas SET latitude = 30.5800000, longitude = 2.8800000 WHERE code = 58;
UPDATE wilayas SET latitude = 34.1074864, longitude = 2.1008486 WHERE code = 59;
UPDATE wilayas SET latitude = 35.3845930, longitude = 5.2893430 WHERE code = 60;
UPDATE wilayas SET latitude = 35.2200000, longitude = 2.3200000 WHERE code = 61;
UPDATE wilayas SET latitude = 34.1500000, longitude = 3.5000000 WHERE code = 62;
UPDATE wilayas SET latitude = 35.4500000, longitude = 2.9000000 WHERE code = 63;
UPDATE wilayas SET latitude = 35.2100000, longitude = 4.1800000 WHERE code = 64;
UPDATE wilayas SET latitude = 32.9000000, longitude = 0.5500000 WHERE code = 65;
UPDATE wilayas SET latitude = 35.2300000, longitude = 5.7000000 WHERE code = 66;
UPDATE wilayas SET latitude = 34.7300000, longitude = 8.0500000 WHERE code = 67;
UPDATE wilayas SET latitude = 35.8800000, longitude = 2.7500000 WHERE code = 68;
UPDATE wilayas SET latitude = 34.2200000, longitude = -1.2500000 WHERE code = 69;
