import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { WishlistItem, RefLink } from '@atur-perjalanan/shared-types';

interface CreateWishlistPayload {
  place_name: string;
  start_time?: string | null;
  end_time?: string | null;
  location_label?: string | null;
  maps_link?: string | null;
  ref_links?: RefLink[];
  notes?: string | null;
  tags?: string[];
  priority_level?: 'high' | 'medium' | 'low';
  thumbnail_url?: string | null;
}

export function useCreateWishlist() {
  const qc = useQueryClient();
  return useMutation<WishlistItem, Error, CreateWishlistPayload>({
    mutationFn: (payload) => apiClient.post<WishlistItem>('/wishlists', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlists'], refetchType: 'all' });
    },
  });
}
