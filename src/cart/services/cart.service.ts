import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import {DBConnectionService} from "../../shared/services/index";

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(private dbService: DBConnectionService) {}

  async findByUserId(userId: string): Promise<any> {
    console.log(userId);

    const cartItems = await this.dbService.runQuery(`
      SELECT * FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id='${userId}')
    `);

    console.log(cartItems);

    return cartItems
  }
  async createByUserId(userId: string) {
    console.log("createByUserId");
    const id = v4(v4());
    const timeStamp = new Date();

    return await this.dbService.runQuery(`
      insert into carts (id, user_id, created_at, updated_at, status, items) values (
        '${id}',
        '${userId},'
        '${timeStamp}',
        '${timeStamp}',
        'OPEN',
        [])
      `).then((data) => {
      return data
    })
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    userId = userId || '46825150-0df4-4ed4-8a73-94dd77de71be';

    const userCart = await this.findByUserId(userId);
    console.log('userCart', userCart);
    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id} = await this.findOrCreateByUserId(userId);
    const timeStamp = new Date();

    return await this.dbService.runQuery(`
      UPDATE carts 
      SET id = ${id}, updated_at = '${timeStamp}', status = 'OPEN', items = ${[...items]})
      WHERE user_id = '${userId}'
      `).then((data) => {
      return data
    });
  }

  removeByUserId(userId): void {
    this.dbService.runQuery(`DELETE FROM carts WHERE id = ${userId}`).then(result => {
      console.log(result);
    })
  }
}
