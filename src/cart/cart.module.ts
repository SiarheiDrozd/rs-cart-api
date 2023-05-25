import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import {DBConnectionService} from "../shared";


@Module({
  imports: [ OrderModule ],
  providers: [ CartService, DBConnectionService ],
  controllers: [ CartController ]
})
export class CartModule {}
