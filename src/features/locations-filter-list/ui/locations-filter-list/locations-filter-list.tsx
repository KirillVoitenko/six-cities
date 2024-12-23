import type { OfferCityName } from '@entities/offer';
import { LocationsFilterItem } from '../locations-filter-item';
import { useActiveLocation } from '@features/locations-filter-list/lib/use-active-location';

type LocationsFilterListProps = {
  activeFilter: OfferCityName;
  allFilterItems: OfferCityName[];
  onFilterChange?: (filterValue: OfferCityName) => void;
}

export function LocationsFilterList({ activeFilter, allFilterItems, onFilterChange }: LocationsFilterListProps): JSX.Element {
  const { activeLocation, changeActiveLocation } = useActiveLocation(activeFilter);
  const linkClickHandler = (filterValue: OfferCityName) => {
    if (filterValue !== activeLocation) {
      changeActiveLocation(filterValue);

      if (onFilterChange) {
        onFilterChange(filterValue);
      }
    }
  };
  return (
    <ul className='locations__list tabs__list'>
      {allFilterItems.map((current) => (
        <LocationsFilterItem filterValue={current} onLinkClick={linkClickHandler} isActive={current === activeFilter} key={`city-filter-${current}`} />
      ))}
    </ul>
  );
}
