import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRef, useEffect, useState, useCallback } from 'react';
import { colors } from '../utils/colors';
import { Search } from 'lucide-react-native';
import { Searchbar } from './Searchbar';
interface TabBarData {
  index: number;
  label: string;
}

interface TabBarProps {
  currentPage: number;
  onTabPress: (index: number) => void;
  animateTo: (value: number) => void;
  tabTranslate: Animated.Value;
  data: TabBarData[];
  children?: React.ReactNode[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const TabBar = ({
  currentPage,
  onTabPress,
  tabTranslate,
  data,
  children,
  searchQuery = '',
  setSearchQuery,
}: TabBarProps) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Sync PagerView with currentPage changes
  useEffect(() => {
    if (pagerRef.current && currentPage !== undefined) {
      pagerRef.current.setPage(currentPage);
    }
  }, [currentPage]);
  // Get container width
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        {/* Tab Headers */}
        <View style={styles.tabContainer} onLayout={onLayout}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.tabIndicator,
              {
                width: containerWidth / data.length,
                transform: [
                  {
                    translateX: tabTranslate.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [
                        0,
                        containerWidth / data.length,
                        (containerWidth / data.length) * 2,
                      ],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
          {data.map((tab, index) => (
            <TouchableOpacity
              key={tab.index}
              style={[styles.tab, { width: `${100 / data.length}%` }]}
              onPress={() => {
                onTabPress(index);
              }}
            >
              <View style={styles.tabLabelWrap}>
                <Animated.Text
                  style={[
                    styles.tabText,
                    currentPage === index && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Animated.Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {setSearchQuery ? (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Search size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {searchVisible && setSearchQuery ? (
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      ) : null}
      {/* PagerView Content */}
      {children && (
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={currentPage}
          onPageSelected={e => {
            const pos = e.nativeEvent.position;
            onTabPress(pos);
          }}
          onPageScroll={e => {
            const { position, offset } = e.nativeEvent;
            tabTranslate.setValue(position + offset);
          }}
          scrollEnabled={true}
          overdrag={false}
        >
          {children}
        </PagerView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: colors.secondary,
    overflow: 'hidden',
    position: 'relative',
    flex: 1,
  },
  pagerView: {
    flex: 1,
    marginTop: 8,
  },
  tabIndicator: {
    position: 'absolute',
    backgroundColor: colors.tertiary, // Bright blue for visibility
    borderRadius: 20,
    height: '98%',
    borderColor: colors.primary,
    borderWidth: 1.5, // Ensure minimum height
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  tabLabelWrap: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
