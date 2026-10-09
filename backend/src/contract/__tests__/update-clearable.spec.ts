import {
  UpdateActivitySchema,
  UpdateWishlistSchema,
  UpdateUserSchema,
  UpdateTripSchema,
  UpdatePollSchema,
} from '@atur-perjalanan/shared-validation';

/**
 * Every update schema must encode "clear this field" so editing can remove a
 * value: `null` clears, `''` clears (normalised to `null`), omission leaves the
 * value unchanged, `[]` clears an array field.
 */
describe('update schemas accept explicit field clearing', () => {
  describe('UpdateActivitySchema', () => {
    it('accepts null to clear text + cover fields', () => {
      const result = UpdateActivitySchema.safeParse({
        description: null,
        location_label: null,
        maps_link: null,
        cover_icon: null,
        thumbnail_url: null,
      });
      expect(result.success).toBe(true);
    });

    it("normalises '' to null (clear) for maps_link", () => {
      const result = UpdateActivitySchema.safeParse({ maps_link: '' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.maps_link).toBeNull();
    });

    it('accepts [] to clear ref_links', () => {
      const result = UpdateActivitySchema.safeParse({ ref_links: [] });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.ref_links).toEqual([]);
    });

    it('still rejects an invalid maps_link', () => {
      expect(UpdateActivitySchema.safeParse({ maps_link: 'not-a-url' }).success).toBe(false);
    });
  });

  describe('UpdateWishlistSchema', () => {
    it("accepts null/''/[] to clear fields", () => {
      const result = UpdateWishlistSchema.safeParse({
        maps_link: '',
        notes: null,
        location_label: null,
        start_time: '',
        thumbnail_url: null,
        ref_links: [],
        tags: [],
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maps_link).toBeNull();
        expect(result.data.start_time).toBeNull();
      }
    });

    it('still rejects an invalid maps_link', () => {
      expect(UpdateWishlistSchema.safeParse({ maps_link: 'not-a-url' }).success).toBe(false);
    });
  });

  describe('UpdateUserSchema', () => {
    it("accepts null/'' to clear bio + website_url", () => {
      const result = UpdateUserSchema.safeParse({
        bio: null,
        website_url: '',
        location_label: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bio).toBeNull();
        expect(result.data.website_url).toBeNull();
      }
    });

    it('still rejects an invalid website_url', () => {
      expect(UpdateUserSchema.safeParse({ website_url: 'not-a-url' }).success).toBe(false);
    });
  });

  describe('UpdateTripSchema', () => {
    it('accepts null/[] to clear times + tags', () => {
      const result = UpdateTripSchema.safeParse({ start_time: '', end_time: null, tags: [] });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.start_time).toBeNull();
        expect(result.data.end_time).toBeNull();
      }
    });
  });

  describe('UpdatePollSchema', () => {
    it('accepts null to clear the deadline', () => {
      expect(UpdatePollSchema.safeParse({ deadline: null }).success).toBe(true);
    });
  });
});
