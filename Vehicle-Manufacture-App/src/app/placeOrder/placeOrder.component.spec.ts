import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '../configuration';
import { DataService } from '../data.service';
import { placeOrder } from './placeOrder.component';
import {PlaceOrderService} from './placeOrder.service';
import { PlaceOrder } from '../org.acme.vehicle_network';
describe('placeOrder', () => {
  let component: PlaceOrder;
  let fixture: ComponentFixture<placeOrder>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ placeOrder ],
imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
providers: [PlaceOrderService,DataService,Configuration]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(placeOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
