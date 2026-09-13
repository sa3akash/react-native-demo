import { useState, useCallback, useRef } from 'react';

export interface ViewTokenItem {
  item: any;
  key: string;
  index?: number | null;
  isViewable?: boolean;
}

export interface ViewabilityConfig {
  itemVisiblePercentThreshold?: number;
  minimumViewTime?: number;
}

export function useViewability(config: ViewabilityConfig = { itemVisiblePercentThreshold: 60 }) {
  const [activeVisibleId, setActiveVisibleId] = useState<string | null>(null);
  const [visibleItemIds, setVisibleItemIds] = useState<string[]>([]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewTokenItem[]; changed: ViewTokenItem[] }) => {
      if (viewableItems.length > 0) {
        const primary = viewableItems[0]?.item?.id || viewableItems[0]?.key || null;
        setActiveVisibleId(primary);
        setVisibleItemIds(viewableItems.map((v) => v.item?.id || v.key).filter(Boolean));
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: config.itemVisiblePercentThreshold || 60,
    minimumViewTime: config.minimumViewTime || 150,
  }).current;

  const isItemVisible = useCallback(
    (id: string) => {
      return activeVisibleId === id;
    },
    [activeVisibleId]
  );

  return {
    activeVisibleId,
    visibleItemIds,
    isItemVisible,
    onViewableItemsChanged,
    viewabilityConfig,
  };
}
