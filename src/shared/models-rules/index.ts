import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return request.user && request.user.id || 'e1121089-1394-474b-9abd-c9171f9d25cd';
}
