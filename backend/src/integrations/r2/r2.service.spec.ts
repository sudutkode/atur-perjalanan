import { ConfigService } from '@nestjs/config';
import { R2Service } from './r2.service';

function makeService(publicUrl: string | undefined): R2Service {
  const values: Record<string, string | undefined> = {
    R2_ACCOUNT_ID: 'test-account',
    R2_BUCKET_NAME: 'test-bucket',
    R2_ACCESS_KEY_ID: 'test-key',
    R2_SECRET_ACCESS_KEY: 'test-secret',
    R2_PUBLIC_URL: publicUrl,
  };
  const config = { get: (key: string) => values[key] } as unknown as ConfigService;
  return new R2Service(config);
}

describe('R2Service', () => {
  describe('resolvePublicUrl', () => {
    it('joins the configured public base with the storage key', () => {
      const service = makeService('https://cdn.example.com/');
      expect(service.resolvePublicUrl('trips/t1/a.jpg')).toBe(
        'https://cdn.example.com/trips/t1/a.jpg',
      );
    });

    it('returns the bare storage key when R2_PUBLIC_URL is empty', () => {
      const service = makeService('');
      expect(service.resolvePublicUrl('trips/t1/a.jpg')).toBe('trips/t1/a.jpg');
    });

    it('returns the bare storage key (and does not throw) when R2_PUBLIC_URL is unset', () => {
      const service = makeService(undefined);
      expect(() => service.resolvePublicUrl('trips/t1/a.jpg')).not.toThrow();
      expect(service.resolvePublicUrl('trips/t1/a.jpg')).toBe('trips/t1/a.jpg');
    });
  });

  describe('extractStorageKey', () => {
    it('derives the key from a full public URL', () => {
      const service = makeService(undefined);
      expect(service.extractStorageKey('https://cdn.example.com/trips/t1/a.jpg')).toBe(
        'trips/t1/a.jpg',
      );
    });

    it('strips leading slashes from a bare key', () => {
      const service = makeService(undefined);
      expect(service.extractStorageKey('/trips/t1/a.jpg')).toBe('trips/t1/a.jpg');
    });
  });
});
