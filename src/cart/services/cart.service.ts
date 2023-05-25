import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import {DBConnectionService} from "../../shared/services/index";

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(private dbService: DBConnectionService) {}

  async findByUserId(userId: string): Promise<any> {
    let items = await this.dbService.runQuery(`
      SELECT * FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id='${userId}')
    `);

    items = items.map(item => {
      return {
        product: {
          price: 1
        },
        ...item
      }
    })
    console.log(items);
    return {
      id: items[0].cart_id,
      items: items
    }
  }
  async createByUserId(userId: string) {

    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    return await this.dbService.runQuery(``).then()

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
