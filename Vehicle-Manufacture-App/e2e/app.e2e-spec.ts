import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for Vehicle-Manufacture-App', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be Vehicle-Manufacture-App', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('Vehicle-Manufacture-App');
    })
  });

  it('network-name should be sample-app@1.0.0',() => {
    var networkName = element(by.css('.network-name')).getWebElement();
    expect(networkName.getText()).toBe('sample-app@1.0.0.bna');
  });

  it('navbar-brand should be Vehicle-Manufacture-App',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('Vehicle-Manufacture-App');
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
