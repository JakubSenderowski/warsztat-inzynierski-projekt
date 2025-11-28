const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	try {
		await prisma.$connect();
		console.log('Połączenie działa.');
	} catch (err) {
		console.error('Błąd połączenia:', err);
	} finally {
		await prisma.$disconnect();
	}
}

main();
