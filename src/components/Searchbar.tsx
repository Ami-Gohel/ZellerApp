import { CircleX, Search } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { TextInput } from 'react-native';

export const Searchbar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  return (
    <View style={styles.searchContainer}>
      <Search color={colors.primary} size={16} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.secondaryText}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <CircleX color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.secondaryText,
  },
});
