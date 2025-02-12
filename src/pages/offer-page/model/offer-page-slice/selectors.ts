import type { RootState } from '@shared/lib/store';

export type SliceState = Pick<RootState, 'fullScreanOffer'>;

export const offerDataSelector = (state: SliceState) => state.fullScreanOffer.offer;
export const offerReviewsSelector = (state: SliceState) => state.fullScreanOffer.comments;
export const offerNearsSelector = (state: SliceState) => state.fullScreanOffer.nearOffers;
export const offerLoadingSelector = (state: SliceState) => state.fullScreanOffer.loading;
