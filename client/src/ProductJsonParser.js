/**
 * Parses products and product categories from the LiveArt json structure.
 * @param json json as string
 * @param baseUrl url to use for links if needed
 * @returns {{categories: Array, products: Array}}
 */
export function parseJson(json, baseUrl) {
  if (baseUrl.length && baseUrl.charAt(baseUrl.length - 1) !== '/') {
    baseUrl += '/';
  }
  const obj = JSON.parse(json);
  const products = [];
  const categories = [];
  const productCategoriesList = obj.productCategoriesList;
  productCategoriesList.forEach(cat => {
    const res = parseNested(cat, baseUrl);
    delete cat.products;
    delete cat.categories;
    products.push(...res.products);
    categories.push(cat, ...res.categories);
  });

  categories.forEach(cat => {
    if (cat.thumbUrl) {
      cat.thumbUrl = baseUrl + cat.thumbUrl;
    }
  });

  products.forEach(p => {

    if (p.locations) {
      p.locations = p.locations.map(loc => ({
        ...loc,
        image: loc.image ? baseUrl + loc.image : undefined,
        mask: loc.mask ? baseUrl + loc.mask : undefined,
        overlayInfo: loc.overlayInfo ? baseUrl + loc.overlayInfo : undefined
      }));
    }

    if (p.thumbUrl) {
      p.thumbUrl = baseUrl + p.thumbUrl;
    }

    if (p.template) {
      p.template = baseUrl + p.template;
    }
  });
  return {categories, products};
}

function parseProducts(cat, baseUrl) {
  const products = [];
  if (cat.products) {
    products.push(...cat.products.map(prod => {
      const p = {
        ...prod,
        colorizables: prod.colorizableElements ?
          prod.colorizableElements.map(
            cr => {
              const o = {...cr, _colors: cr.colors};
              delete o.colors;
              return o;
            }
          ) : [],
        colors: prod.colors ? prod.colors.map(
          c => {
            if (c.location) {
              c.location.map(
                loc => {
                  if (loc.image) {
                    loc.image = baseUrl + loc.image;
                  }

                  if (loc.mask) {
                    loc.mask = baseUrl + loc.mask;
                  }
                });
            }
            return c;
          }) : []
      };
      delete p.colorizableElements;
      return p;
    }));
  }
  return products;
}

function parseNested(category, baseUrl) {
  const res = {categories: [], products: []};
  res.products.push(...parseProducts(category, baseUrl));
  if (category.categories) {
    category.categories.forEach(cat => {
      const categories = [];
      res.products.push(...parseProducts(cat, baseUrl));
      delete cat.products;
      if (cat.categories) {
        categories.push(...cat.categories);
      }
      delete cat.categories;
      res.categories.push({...cat, productsCategoryId: category.id});
      categories.forEach(cat2 => {
        const parsed = parseNested(cat2, baseUrl);
        delete cat2.categories;
        delete cat2.products;
        res.categories.push({...cat2, productsCategoryId: cat.id});
        res.categories.push(...parsed.categories);
        res.products.push(...parsed.products);
      });
    });
  }
  return res;
}
