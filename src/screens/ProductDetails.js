import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import {Rating} from 'react-native-ratings';
import Carousel from 'react-native-reanimated-carousel';

import icons from '../helper/constants/icon';
import {hp, wp} from '../helper/GlobalFunc';
import colors from '../helper/constants/colors';

const {width} = Dimensions.get('window');
const ProductDetails = ({route, navigation}) => {
  const product = route?.params?.productDetail;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMore, setShowMore] = useState(true);

  const handleSnapToItem = index => {
    setCurrentIndex(index);
  };

  let numberOfLines = 2;
  const getAvailability = stock => (stock > 0 ? 'In Stock' : 'Out of Stock');

  const carouselRef = useRef(null);

  const SwiperDots = ({currentIndex, length, carouselRef}) => {
    if (length <= 1) return null;

    return (
      <View style={styles.dotsContainer}>
        {Array.from({length}).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              carouselRef.current?.scrollTo({index, animated: true});
              setCurrentIndex(index);
            }}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? colors.black : colors.lightGray,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.arrow} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headText}>{product?.title}</Text>
        <View style={styles.icon}></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.slideIndicator}>
          {currentIndex + 1}/{product?.images?.length}
        </Text>

        <View style={styles.container}>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            height={300}
            data={product?.images}
            onSnapToItem={index => handleSnapToItem(index)}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Image source={{uri: item}} style={styles.image} />
              </View>
            )}
          />
          <SwiperDots
            currentIndex={currentIndex}
            length={product?.images?.length}
            carouselRef={carouselRef}
          />
        </View>

        <View style={styles.rowSpaceBetween}>
          <View style={{flex: 1}}>
            <Text style={{...styles.label, marginBottom: hp(10)}}>
              {'Description'}
            </Text>
            <Text
              numberOfLines={showMore ? numberOfLines : null}
              style={styles.description}>
              {product?.description}
            </Text>
            <Text
              onPress={() => setShowMore(!showMore)}
              style={{
                fontSize: 13,
                color: showMore ? colors.primary : colors.red,
              }}>
              {showMore ? 'Read More' : 'Less'}
            </Text>
          </View>

          <View style={styles.priceView}>
            <Text style={styles.price}>${product?.price}</Text>
          </View>
        </View>

        <View style={styles.border} />

        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>{'Stock'}</Text>
          <Text style={styles.label}>{product?.stock}</Text>
        </View>

        <View style={styles.row}>
          <View
            style={{
              ...styles.stockStatusBox,
              backgroundColor:
                getAvailability(product?.stock) === 'In Stock'
                  ? colors.primary
                  : colors.red,
            }}>
            <Text style={styles.stockStatusText}>
              {getAvailability(product?.stock)}
            </Text>
          </View>
        </View>

        <View style={styles.rowSpaceBetween}>
          <Text style={styles.label}>{'Rating'}</Text>

          <Text style={styles.label}>{product?.rating}</Text>
        </View>
        <Rating
          type="star"
          startingValue={product?.rating}
          readonly
          imageSize={20}
          ratingCount={5}
          fractions={1}
          style={{
            marginBottom: hp(20),
            alignSelf: 'flex-start',
          }}
        />
        <Text style={styles.label}>{'Discount Percentage'}</Text>
        <Text style={styles.discountText}>{product?.discountPercentage}%</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: wp(width),
    height: hp(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: wp(20),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(20),
  },
  icon: {
    height: hp(25),
    width: hp(25),
  },
  headText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  slideIndicator: {
    fontSize: 14,
    color: colors.darkGray,
    alignSelf: 'flex-end',
  },

  dotsContainer: {
    flexDirection: 'row',
    paddingVertical: hp(10),
    justifyContent: 'center',
  },
  dot: {
    width: wp(10),
    height: hp(10),
    borderRadius: 5,
    marginHorizontal: wp(5),
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(10),
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGray,
  },
  description: {
    fontSize: 13,
    color: colors.gray,
  },
  priceView: {
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    paddingVertical: hp(5),
    paddingHorizontal: wp(12),
    marginLeft: wp(10),
  },
  border: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginVertical: hp(20),
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(5),
  },
  stockStatusBox: {
    paddingVertical: hp(7),
    paddingHorizontal: wp(20),
    borderRadius: 6,
    marginBottom: hp(20),
  },
  stockStatusText: {
    color: colors.white,
    fontWeight: '600',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
  },
  discountText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center',
  },
});
