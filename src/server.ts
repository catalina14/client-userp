import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'

import indexRoutes from './routes/indexRoutes'
import UserRoutes from './routes/UsersRoutes'

class Server {
   public app: express.Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config(){
        const MONGO_URI = 'mongodb+srv://catalina:cata2004@cluster0.o3ed9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        mongoose.set('useFindAndModify', true);
        mongoose.connect(MONGO_URI || process.env.MONGODB_URL , {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
            .then(db => console.log('DB is connected'));

        // Settings
        this.app.set('port', process.env.PORT || 3001);

        // Middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes(){
        this.app.use(indexRoutes);
        this.app.use('/api/users', UserRoutes);
    }

    start(){
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();