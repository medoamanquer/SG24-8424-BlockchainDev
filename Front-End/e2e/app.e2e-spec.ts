import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for Front-End', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be Front-End', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('Front-End');
    })
  });

  it('navbar-brand should be car-network@1.0.0',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('car-network@1.0.0');
  });

  
    it('Order component should be loadable',() => {
      page.navigateTo('/Order');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Order');
    });

    it('Order table should have 6 columns',() => {
      page.navigateTo('/Order');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });

  
    it('Vehicle component should be loadable',() => {
      page.navigateTo('/Vehicle');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Vehicle');
    });

    it('Vehicle table should have 5 columns',() => {
      page.navigateTo('/Vehicle');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });

  

});
