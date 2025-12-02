import admin from "firebase-admin";

// la credencial de firestore al bajarla desde firestores es un archivo json
// este archivo json lo transformamos en solo una linea utilizando
//la paleta de comandos de vscode "joins lines", que deja el json en una sola linea,
//luego copiamos la linea en la variablde de entorno en .env y por ultimo lo envolvemos
//todo en comillas simples (si o si simples).
//luego para utilizar la variable de entorno debemos covertirla nuevamente en JSON con
// JSON.parse()
const serviceAccount = JSON.parse(process.env.CONNECTION_FIRESTORE);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

//vercel y firebase recomiendan inicializar la app de firebase de esta manera
//para que se ejecute solo una vez y no de error por inicializaciones multiples
//veces que es lo que pasa en el entorno serverless de vercel, para eso el if
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

//creamos una instancia de firestore
const firestore = admin.firestore();

export { firestore };
