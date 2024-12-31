import { connect } from 'mongoose';
import { ClientModel } from '../src/auth/schema/client.schema';

async function addClient() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://root:root@localhost:27017/snaggable?authSource=admin';
  await connect(mongoUri);

  const client = new ClientModel({
    clientId: 'On$Xe=Kx3F?pp3cDRa?}o-bY*[WMK8A$,ROGt%hV*8uveHjM',
    clientSecret: 'MHww%?p1fgk6N[!9U1T*a{?0(@M==_a{#74}!*vuLEUM^rf<',
    clientName: 'Web Application',
    isActive: true,
  });

  await client.save();
  console.log('Client added successfully:', client);
  process.exit();
}

addClient().catch((error) => {
  console.error('Error adding client:', error);
  process.exit(1);
});
