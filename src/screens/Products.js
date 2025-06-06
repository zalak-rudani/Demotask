import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import Modal from 'react-native-modal';
import {debounce} from 'lodash';

import {hp, wp} from '../helper/GlobalFunc';
import icons from '../helper/constants/icon';
import colors from '../helper/constants/colors';
import {getProductsData} from '../api/axios/actions';

const Products = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [productsData, setProductsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRate, setSelectedRate] = useState([]);
  const [selectedStock, setSelectedStock] = useState([]);
  const [data, setData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('View All');

  const getProductListData = async () => {
    try {
      const request = {
        data: {},
        onSuccess: async res => {
          setProductsData(res?.products);
          setFilteredData(res?.products);
        },
        onFail: err => {
          console.log('err : ', err);
        },
      };
      await getProductsData(request);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductListData();
  }, []);

  const selectRateAndStockData = [
    ...selectedRate.map(item => ({type: 'rate', value: item})),
    ...selectedStock.map(item => ({type: 'stock', value: item})),
  ];

  const debouncedSearch = useCallback(
    debounce(text => {
      setSearchText(text);
    }, 700),
    [],
  );

  const handleChangeText = text => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const applyFilters = useCallback(() => {
    let data = [...productsData];

    if (selectedRate.length > 0) {
      data = data.filter(item =>
        selectedRate.includes(Math.floor(item.rating)),
      );
    }

    if (selectedStock.length > 0) {
      data = data.filter(item => {
        const stock = item.stock;
        return selectedStock.some(range => {
          if (range === 'Out of stock') return stock === 0;
          if (range === '0 - 49') return stock >= 1 && stock <= 49;
          if (range === '50 - 99') return stock >= 50 && stock <= 99;
          if (range === '100 more') return stock >= 100;
          return false;
        });
      });
    }

    if (selectedCategory !== 'View All') {
      data = data.filter(item => item.category === selectedCategory);
    }

    if (searchText.trim() !== '') {
      data = data.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    setFilteredData(data);
  }, [productsData, selectedCategory, selectedRate, selectedStock, searchText]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const stockValue = ['Out of stock', '0 - 49', '50 - 99', '100 more'];
  const rate = [1, 2, 3, 4, 5];

  const HighlightedText = (text, highlight) => {
    if (!highlight) return <Text style={styles.productTitle}>{text}</Text>;

    const regex = new RegExp(`(${highlight})`, 'i');
    const parts = text.split(regex);

    return (
      <Text style={styles.productTitle}>
        {parts.map((item, index) => (
          <Text
            key={index}
            style={
              item.toLowerCase() === highlight.toLowerCase()
                ? styles.highlightedText
                : {}
            }>
            {item}
          </Text>
        ))}
      </Text>
    );
  };

  const uniqueCategories = [
    ...new Set(productsData?.map(item => item.category)),
  ];
  uniqueCategories.unshift('View All');

  const handleCategorySelect = category => {
    setSelectedCategory(category);

    if (category === 'View All') {
      setFilteredData(productsData);
    } else {
      const filteredProducts = productsData.filter(
        item => item?.category === category,
      );

      setFilteredData(filteredProducts);
    }
  };

  const productListCardRender = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.productListCard}
        onPress={() =>
          navigation.navigate('ProductDetails', {productDetail: item})
        }>
        <View style={styles.titleContainer}>
          {HighlightedText(item?.title, searchText)}
        </View>
        <Image
          style={styles.productCardImage}
          source={{
            uri: item?.thumbnail,
          }}
        />
        <View style={styles.priceView}>
          <Text style={styles.price}>${item?.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const categoryListRender = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.categoryBox,
          backgroundColor:
            item === selectedCategory ? colors.primary : colors.white,
        }}
        onPress={() => {
          handleCategorySelect(item);
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: item === selectedCategory ? colors.white : colors.black,
          }}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const rateRender = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => toggleSelection(item, selectedRate, setSelectedRate)}
      style={{
        ...styles.rateList,
        borderColor: selectedRate.includes(item)
          ? colors.primary
          : colors.black,
        backgroundColor: selectedRate.includes(item)
          ? colors.primary
          : colors.white,
      }}>
      <Text
        style={{
          ...styles.rateBox,
          color: selectedRate.includes(item) ? colors.white : colors.black,
        }}>
        {item}
      </Text>
      <Image style={styles.icon15} source={icons.star} />
    </TouchableOpacity>
  );
  const stockRender = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => toggleSelection(item, selectedStock, setSelectedStock)}
      style={{
        ...styles.stockList,
        borderColor: selectedStock.includes(item)
          ? colors.primary
          : colors.black,
        backgroundColor: selectedStock.includes(item)
          ? colors.primary
          : colors.white,
      }}>
      <Text
        style={{
          textAlign: 'center',
          color: selectedStock.includes(item) ? colors.white : colors.black,
        }}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const selectRateAndStockDataRender = ({item}) => (
    <TouchableOpacity
      style={styles.selectedRateAndStock}
      onPress={() =>
        item.type === 'rate'
          ? toggleSelection(item.value, selectedRate, setSelectedRate)
          : toggleSelection(item.value, selectedStock, setSelectedStock)
      }>
      <Image source={icons.close} style={styles.icon15} />
      <Text style={styles.selectionText}>{item.value}</Text>
      {item.type === 'rate' ? (
        <Image source={icons.star} style={styles.icon15} />
      ) : null}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainView}>
      <View>
        <View style={styles.textInputView}>
          <Image source={icons.search} style={styles.icon} />
          <TextInput
            placeholder="Type something..."
            style={styles.textInput}
            onChangeText={text => handleChangeText(text)}
            value={searchText}
          />
          <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
            <Image source={icons.filter} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <Text
          style={
            styles.dataLength
          }>{`Total ${filteredData?.length} products found.`}</Text>

        {(selectedRate.length > 0 || selectedStock.length > 0) && (
          <FlatList
            style={styles.selectedRateAndStockList}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={selectRateAndStockData}
            renderItem={selectRateAndStockDataRender}
          />
        )}
        <FlatList
          showsHorizontalScrollIndicator={false}
          style={styles.categoryListRender}
          horizontal={true}
          data={uniqueCategories}
          renderItem={categoryListRender}
        />
      </View>

      <View style={{flex: 1}}>
        {filteredData.length ? (
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: wp(5),
            }}
            numColumns={2}
            data={filteredData}
            renderItem={productListCardRender}
          />
        ) : (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>{'No data found !'}</Text>
          </View>
        )}
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalFilterContainerView}>
          <Text style={styles.filterByText}>{'Filter By'}</Text>
          <Text style={styles.modalSubHeadText}>{'Rating'}</Text>
          <FlatList horizontal={true} data={rate} renderItem={rateRender} />
          <Text style={styles.modalSubHeadText}>{'Stock'}</Text>
          <FlatList
            horizontal={true}
            data={stockValue}
            renderItem={stockRender}
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>{'Apply'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  modal: {
    margin: wp(0),
    justifyContent: 'flex-end',
  },
  selectedRateAndStockList: {
    marginVertical: hp(10),
    marginLeft: wp(10),
  },
  button: {
    backgroundColor: colors.primary,
    padding: wp(10),
    marginHorizontal: hp(120),
    borderRadius: 10,
    height: hp(50),
    marginVertical: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: colors.white,
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  noDataView: {
    alignItems: 'center',
    padding: hp(15),
    borderRadius: 5,
    justifyContent: 'center',
    flex: 1,
  },
  rateBox: {
    textAlign: 'center',
    marginRight: wp(3),
  },
  stockList: {
    padding: wp(10),
    marginVertical: hp(5),
    marginHorizontal: wp(2),
    borderRadius: 5,
    borderWidth: 1,
    height: hp(40),
  },
  noDataText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
  },
  selectedRateAndStock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingVertical: hp(5),
    paddingHorizontal: wp(10),
    marginRight: wp(10),
  },
  selectionText: {
    textAlign: 'center',
    marginHorizontal: wp(4),
    color: colors.white,
  },
  filterByText: {
    marginTop: hp(20),
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubHeadText: {
    fontSize: 20,
    marginBottom: hp(10),
    marginTop: hp(20),
  },
  categoryBox: {
    marginVertical: hp(10),
    marginRight: wp(20),
    padding: wp(10),
    height: hp(40),
    borderRadius: 10,
  },
  categoryListRender: {
    marginLeft: wp(10),
  },
  titleContainer: {
    width: '100%',
    minHeight: hp(50),
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  productListCard: {
    backgroundColor: colors.white,
    margin: wp(10),
    padding: wp(10),
    borderRadius: 10,
    height: hp(250),
    width: wp(171),
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: {width: wp(0), height: hp(1)},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  rateList: {
    padding: wp(10),
    borderRadius: 8,
    flexDirection: 'row',
    borderWidth: wp(1),
    marginRight: wp(8),
    alignItems: 'center',
    marginBottom: hp(8),
  },
  textInput: {
    flex: 1,
    marginRight: wp(10),
  },
  textInputView: {
    backgroundColor: colors.white,
    marginHorizontal: wp(10),
    padding: hp(12),
    borderRadius: 5,
    flexDirection: 'row',
  },
  icon: {
    height: hp(20),
    width: hp(20),
    marginRight: wp(10),
  },
  productCardImage: {
    height: hp(120),
    width: hp(120),
    resizeMode: 'contain',
    marginVertical: hp(5),
  },
  priceView: {
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    padding: wp(6),
    width: '80%',
    alignItems: 'center',
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  dataLength: {
    marginLeft: wp(10),
    marginVertical: hp(10),
  },
  rating: {
    padding: hp(12),
    borderRadius: 10,
    flexDirection: 'row',
    width: wp(50),
    marginHorizontal: wp(10),
    marginVertical: hp(10),
    alignItems: 'center',
  },
  highlightedText: {
    fontSize: 14,
    color: colors.primary,
  },
  icon15: {
    height: hp(15),
    width: hp(15),
  },
  productTitle: {
    fontSize: 15,
    textAlign: 'center',
    width: '100%',
    maxHeight: hp(50),
    overflow: 'visible',
    color: colors.black,
  },
  modalFilterContainerView: {
    backgroundColor: colors.white,
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    padding: wp(15),
  },
});
