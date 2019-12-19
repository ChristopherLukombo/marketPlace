import { InjectionToken } from '@angular/core';
import ipfs from 'ipfs';

export const IPFS = new InjectionToken(
  'The IPFS instance',
  {
    providedIn: 'root',
    factory: () => new ipfs({
      init: true,
      start: true,
      config: {
        Bootstrap: []
      }
    })
  },
);

/**
 * Wait for the IPFS node to be initialized when the app is launched
 * @param node The Instance of the ipfs constructor
 */
export function initIPFS(node) {
  return () => {
    return new Promise((resolve, reject) => {
      node.on('error', () => reject());
      node.on('ready', () => resolve());
    });
  };
}

