import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'net';
import { app } from '../server/app.ts';

test('Server Startup & Port Binding', async (t) => {
  await t.test('App instance binds to port and shuts down cleanly', async () => {
    // Find a free port
    const testServer = app.listen(0);

    await new Promise<void>((resolve) => {
      testServer.on('listening', () => resolve());
    });

    const address = testServer.address() as net.AddressInfo;
    assert.ok(address.port > 0);

    // Verify socket connection
    const socket = net.createConnection({ port: address.port }, () => {
      socket.end();
    });

    await new Promise<void>((resolve) => {
      socket.on('close', () => resolve());
    });

    // Clean shutdown
    await new Promise<void>((resolve, reject) => {
      testServer.close((err) => (err ? reject(err) : resolve()));
    });
  });
});
