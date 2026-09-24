/* ===========================================================
   MK CAREER GUIDANCE — Cutoff Calculator sample dataset
   ⚠ SAMPLE / DEMO DATA ONLY — not official TNEA figures.
   Replace CUTOFF_DATA with real data (e.g. loaded from a CSV/JSON
   you export from the official source) before using this for
   real admission decisions. Always double check on tneaonline.org.
   =========================================================== */
var CUTOFF_DATA = [
  {college:"PSG College of Technology", district:"Coimbatore", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:199.50,BC:198.25,BCM:196.75,MBC:195.00,SC:181.25,SCA:172.00,ST:166.50}},
  {college:"PSG College of Technology", district:"Coimbatore", branch:"Electronics & Communication Engineering", year:2025, cutoffs:{OC:197.25,BC:196.00,BCM:194.00,MBC:192.50,SC:178.00,SCA:168.00,ST:162.00}},
  {college:"PSG College of Technology", district:"Coimbatore", branch:"Mechanical Engineering", year:2025, cutoffs:{OC:189.00,BC:186.50,BCM:183.00,MBC:180.00,SC:165.00,SCA:154.00,ST:148.00}},
  {college:"Coimbatore Institute of Technology", district:"Coimbatore", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:198.00,BC:196.75,BCM:194.50,MBC:192.00,SC:177.00,SCA:167.00,ST:160.00}},
  {college:"Coimbatore Institute of Technology", district:"Coimbatore", branch:"Information Technology", year:2025, cutoffs:{OC:195.50,BC:193.75,BCM:191.00,MBC:188.50,SC:172.00,SCA:161.00,ST:155.00}},
  {college:"Government College of Technology, Coimbatore", district:"Coimbatore", branch:"Civil Engineering", year:2025, cutoffs:{OC:180.00,BC:176.50,BCM:172.00,MBC:168.00,SC:152.00,SCA:140.00,ST:134.00}},
  {college:"Government College of Technology, Coimbatore", district:"Coimbatore", branch:"Electrical & Electronics Engineering", year:2025, cutoffs:{OC:188.50,BC:185.00,BCM:181.00,MBC:177.50,SC:160.00,SCA:148.00,ST:141.00}},
  {college:"Kumaraguru College of Technology", district:"Coimbatore", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:193.00,BC:190.50,BCM:187.00,MBC:184.00,SC:167.00,SCA:155.00,ST:149.00}},
  {college:"Kumaraguru College of Technology", district:"Coimbatore", branch:"Mechanical Engineering", year:2025, cutoffs:{OC:175.00,BC:170.00,BCM:165.00,MBC:160.00,SC:142.00,SCA:130.00,ST:124.00}},
  {college:"College of Engineering, Guindy (Anna University)", district:"Chennai", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:200.00,BC:199.75,BCM:199.00,MBC:198.50,SC:190.00,SCA:182.00,ST:176.00}},
  {college:"College of Engineering, Guindy (Anna University)", district:"Chennai", branch:"Electronics & Communication Engineering", year:2025, cutoffs:{OC:199.25,BC:198.00,BCM:196.50,MBC:195.00,SC:185.00,SCA:175.00,ST:168.00}},
  {college:"Madras Institute of Technology, Chennai", district:"Chennai", branch:"Electronics & Communication Engineering", year:2025, cutoffs:{OC:198.75,BC:197.00,BCM:195.00,MBC:193.00,SC:181.00,SCA:170.00,ST:163.00}},
  {college:"SSN College of Engineering", district:"Chennai", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:197.00,BC:195.00,BCM:192.50,MBC:190.00,SC:172.00,SCA:160.00,ST:153.00}},
  {college:"SSN College of Engineering", district:"Chennai", branch:"Information Technology", year:2025, cutoffs:{OC:194.50,BC:192.00,BCM:189.00,MBC:186.00,SC:168.00,SCA:156.00,ST:149.00}},
  {college:"Thiagarajar College of Engineering", district:"Madurai", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:192.50,BC:190.00,BCM:187.00,MBC:184.00,SC:165.00,SCA:152.00,ST:145.00}},
  {college:"Thiagarajar College of Engineering", district:"Madurai", branch:"Mechanical Engineering", year:2025, cutoffs:{OC:172.00,BC:167.00,BCM:162.00,MBC:157.00,SC:138.00,SCA:126.00,ST:120.00}},
  {college:"Mepco Schlenk Engineering College", district:"Sivakasi", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:186.00,BC:182.00,BCM:178.00,MBC:174.00,SC:155.00,SCA:142.00,ST:135.00}},
  {college:"Government College of Engineering, Salem", district:"Salem", branch:"Electrical & Electronics Engineering", year:2025, cutoffs:{OC:178.00,BC:173.00,BCM:168.00,MBC:163.00,SC:144.00,SCA:131.00,ST:124.00}},
  {college:"National Engineering College, Kovilpatti", district:"Tuticorin", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:180.00,BC:175.00,BCM:170.00,MBC:165.00,SC:146.00,SCA:133.00,ST:126.00}},
  {college:"Government College of Engineering, Tirunelveli", district:"Tirunelveli", branch:"Civil Engineering", year:2025, cutoffs:{OC:170.00,BC:165.00,BCM:160.00,MBC:155.00,SC:135.00,SCA:122.00,ST:115.00}},
  {college:"Anna University Regional Campus, Tiruchirappalli", district:"Tiruchirappalli", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:188.00,BC:184.00,BCM:180.00,MBC:176.00,SC:157.00,SCA:144.00,ST:137.00}},
  {college:"Anna University Regional Campus, Tiruchirappalli", district:"Tiruchirappalli", branch:"Mechanical Engineering", year:2025, cutoffs:{OC:168.00,BC:163.00,BCM:158.00,MBC:153.00,SC:133.00,SCA:120.00,ST:113.00}},
  {college:"Government College of Engineering, Bargur", district:"Krishnagiri", branch:"Computer Science Engineering", year:2025, cutoffs:{OC:165.00,BC:160.00,BCM:155.00,MBC:150.00,SC:130.00,SCA:117.00,ST:110.00}},
  {college:"Nachimuthu Polytechnic College area — Sample Engg College", district:"Pollachi", branch:"Mechanical Engineering", year:2025, cutoffs:{OC:160.00,BC:155.00,BCM:150.00,MBC:145.00,SC:125.00,SCA:112.00,ST:105.00}}
];
