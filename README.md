# Istanbul Tips

Mappa di Istanbul con i miei consigli (ristoranti, cose da vedere…). Sito in **italiano e inglese**, con barra di ricerca "Dove sei?" che mostra i consigli più vicini, e un'**area admin** per aggiungere posti da interfaccia.

## Funzioni
- Mappa vettoriale MapLibre + OpenFreeMap (gratuita, nessuna API key né carta)
- Ricerca posizione (Nominatim/OpenStreetMap) o geolocalizzazione con puntino blu che segue i tuoi spostamenti → consigli entro un raggio regolabile, ordinati per distanza
- Filtri per categoria (Mangiare, Caffè, Bar, Discoteche, Da vedere, Hamam, Quartieri, Dove alloggiare) e flag **Da non perdere**, switch IT/EN
- Traduzione automatica IT→EN della descrizione quando aggiungi un posto (MyMemory, gratuita)
- Admin: pulsante **Admin** in alto → password → aggiungi posto (incolla un link Google Maps per compilare nome e coordinate, oppure clicca sulla mappa), modifica ed elimina i posti già inseriti

## Deploy (Vercel)
1. Importa il repo su Vercel.
2. Storage → crea un **Blob store** e collegalo al progetto (imposta `BLOB_READ_WRITE_TOKEN`).
3. (Consigliato) imposta la variabile `ADMIN_PASSWORD`; se assente, la password di default è quella indicata nel codice `api/places.js`.

Senza Blob configurato il sito funziona comunque con i posti di `data/places.json`; le aggiunte admin restano salvate solo nel browser di chi le fa.

## Dati iniziali
`data/places.json`. Categorie: `eat`, `cafe`, `bar`, `club`, `see`, `hamam`, `area`, `stay`; campo opzionale `mustSee` (true/false).
