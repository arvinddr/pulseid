db.auth('root', 'pulseid')

db = db.getSiblingDB('admin')

db.createUser(
    {
        user: 'cashbackapp',
        pwd:  'pulseid',
        roles: [
            {
                role: "readWrite",
                db: 'admin'
            }
        ]
    }
);