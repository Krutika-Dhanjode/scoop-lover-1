import { useState, useEffect, useRef } from "react";
import "./App.css";

// ============================================================
// CORRECT RATES FROM PDF (FINAL_PRICE_RETAIL_14_SS_)
// SS Rate = Retail Rate (from the PDF "Retail Rate" column)
// Dist Rate = Dist RATE column from PDF
// ============================================================
const PRODUCTS_DEFAULT = [
  {id:1,srNo:1,category:"Big Cup",ml:"55 ML",name:"Vanilla",mrp:10,pcs:24,boxMrp:240,retailMargin:0.23,ssRate:194.96,distMargin:0.14,distRate:171.02,unitInCrate:6},
  {id:2,srNo:2,category:"Big Cup",ml:"55 ML",name:"Pista",mrp:10,pcs:24,boxMrp:240,retailMargin:0.23,ssRate:194.96,distMargin:0.14,distRate:171.02,unitInCrate:6},
  {id:3,srNo:3,category:"Big Cup",ml:"55 ML",name:"Strawberry",mrp:10,pcs:24,boxMrp:240,retailMargin:0.23,ssRate:194.96,distMargin:0.14,distRate:171.02,unitInCrate:6},
  {id:4,srNo:4,category:"Boat Cups",ml:"90 ML",name:"American Nuts",mrp:20,pcs:12,boxMrp:240,retailMargin:0.24,ssRate:193.11,distMargin:0.14,distRate:169.40,unitInCrate:8},
  {id:5,srNo:5,category:"Boat Cups",ml:"90 ML",name:"Mango",mrp:20,pcs:12,boxMrp:240,retailMargin:0.24,ssRate:193.11,distMargin:0.14,distRate:169.40,unitInCrate:8},
  {id:6,srNo:6,category:"Boat Cups",ml:"90 ML",name:"Mawa Badam",mrp:20,pcs:12,boxMrp:240,retailMargin:0.24,ssRate:193.11,distMargin:0.14,distRate:169.40,unitInCrate:8},
  {id:7,srNo:7,category:"Boat Cups",ml:"90 ML",name:"Butter Scotch",mrp:20,pcs:12,boxMrp:240,retailMargin:0.24,ssRate:193.11,distMargin:0.14,distRate:169.40,unitInCrate:8},
  {id:8,srNo:8,category:"Boat Cups",ml:"90 ML",name:"Tutti Fruiti",mrp:20,pcs:12,boxMrp:240,retailMargin:0.24,ssRate:193.11,distMargin:0.14,distRate:169.40,unitInCrate:8},
  {id:9,srNo:9,category:"Boat Cups",ml:"90 ML",name:"Chocolate Fudge",mrp:20,pcs:12,boxMrp:240,retailMargin:0.25,ssRate:193.11,distMargin:0.14,distRate:169.40,unitInCrate:8},
  {id:10,srNo:10,category:"Premium Cups",ml:"100 ML",name:"Chocolate Chips",mrp:30,pcs:12,boxMrp:360,retailMargin:0.24,ssRate:289.69,distMargin:0.14,distRate:254.12,unitInCrate:8},
  {id:11,srNo:11,category:"Premium Cups",ml:"100 ML",name:"Dryfruit Malai Kulfi",mrp:30,pcs:12,boxMrp:360,retailMargin:0.24,ssRate:289.69,distMargin:0.14,distRate:254.12,unitInCrate:8},
  {id:12,srNo:12,category:"Premium Cups",ml:"100 ML",name:"Fruit Cocktail",mrp:30,pcs:12,boxMrp:360,retailMargin:0.24,ssRate:289.69,distMargin:0.14,distRate:254.12,unitInCrate:8},
  {id:13,srNo:13,category:"Premium Cups",ml:"100 ML",name:"Raj Bhog",mrp:30,pcs:12,boxMrp:360,retailMargin:0.24,ssRate:289.69,distMargin:0.14,distRate:254.12,unitInCrate:8},
  {id:14,srNo:14,category:"Premium Cups",ml:"100 ML",name:"Sitafal",mrp:40,pcs:12,boxMrp:480,retailMargin:0.29,ssRate:371.40,distMargin:0.14,distRate:325.79,unitInCrate:8},
  {id:15,srNo:15,category:"Premium Cups",ml:"100 ML",name:"Tender Coconut",mrp:40,pcs:12,boxMrp:480,retailMargin:0.29,ssRate:371.40,distMargin:0.14,distRate:325.79,unitInCrate:8},
  {id:16,srNo:16,category:"Premium Cups",ml:"100 ML",name:"Choco Almond",mrp:40,pcs:12,boxMrp:480,retailMargin:0.29,ssRate:371.40,distMargin:0.14,distRate:325.79,unitInCrate:8},
  {id:17,srNo:17,category:"Premium Cups",ml:"100 ML",name:"Belgium Chocolate",mrp:40,pcs:12,boxMrp:480,retailMargin:0.29,ssRate:371.40,distMargin:0.14,distRate:325.79,unitInCrate:8},
  {id:18,srNo:18,category:"Small Cup",ml:"30 ML",name:"Vanilla",mrp:5,pcs:30,boxMrp:150,retailMargin:0.16,ssRate:130.09,distMargin:0.12,distRate:116.16,unitInCrate:8},
  {id:19,srNo:19,category:"Small Cup",ml:"30 ML",name:"Pista",mrp:5,pcs:30,boxMrp:150,retailMargin:0.16,ssRate:130.09,distMargin:0.12,distRate:116.16,unitInCrate:8},
  {id:20,srNo:20,category:"Small Cone",ml:"50 ML",name:"Choco Vanilla",mrp:10,pcs:36,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.12,distRate:267.22,unitInCrate:6},
  {id:21,srNo:21,category:"Small Cone",ml:"50 ML",name:"Pista",mrp:10,pcs:36,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.12,distRate:267.22,unitInCrate:6},
  {id:22,srNo:22,category:"Small Cone",ml:"50 ML",name:"Butter Scotch",mrp:10,pcs:36,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.12,distRate:267.22,unitInCrate:6},
  {id:23,srNo:23,category:"Small Cone",ml:"50 ML",name:"Chocolate",mrp:10,pcs:36,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.12,distRate:267.22,unitInCrate:6},
  {id:24,srNo:24,category:"Medium Cone",ml:"80 ML",name:"Butter Scotch",mrp:10,pcs:24,boxMrp:240,retailMargin:0.15,ssRate:208.00,distMargin:0.12,distRate:185.86,unitInCrate:6},
  {id:25,srNo:25,category:"Medium Cone",ml:"80 ML",name:"Badam",mrp:10,pcs:24,boxMrp:240,retailMargin:0.15,ssRate:208.00,distMargin:0.12,distRate:185.86,unitInCrate:6},
  {id:26,srNo:26,category:"Medium Cone",ml:"80 ML",name:"Mango",mrp:10,pcs:24,boxMrp:240,retailMargin:0.15,ssRate:208.00,distMargin:0.12,distRate:185.86,unitInCrate:6},
  {id:27,srNo:27,category:"Big Cone",ml:"120 ML",name:"Vanilla",mrp:20,pcs:18,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.13,distRate:264.70,unitInCrate:6},
  {id:28,srNo:28,category:"Big Cone",ml:"120 ML",name:"Strawberry",mrp:20,pcs:18,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.13,distRate:264.70,unitInCrate:6},
  {id:29,srNo:29,category:"Big Cone",ml:"120 ML",name:"Pista",mrp:20,pcs:18,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.13,distRate:264.70,unitInCrate:6},
  {id:30,srNo:30,category:"Big Cone",ml:"120 ML",name:"Chocolate",mrp:30,pcs:18,boxMrp:540,retailMargin:0.29,ssRate:417.82,distMargin:0.14,distRate:366.51,unitInCrate:6},
  {id:31,srNo:31,category:"Big Cone",ml:"120 ML",name:"Butter Scotch",mrp:30,pcs:18,boxMrp:540,retailMargin:0.29,ssRate:417.82,distMargin:0.14,distRate:366.51,unitInCrate:6},
  {id:32,srNo:32,category:"Big Cone",ml:"120 ML",name:"Double Chocolate",mrp:40,pcs:18,boxMrp:720,retailMargin:0.29,ssRate:557.10,distMargin:0.14,distRate:488.69,unitInCrate:6},
  {id:33,srNo:33,category:"Ice Candy",ml:"40 ML",name:"Orange Blast",mrp:5,pcs:30,boxMrp:150,retailMargin:0.16,ssRate:130.00,distMargin:0.12,distRate:116.16,unitInCrate:6},
  {id:34,srNo:34,category:"Ice Candy",ml:"40 ML",name:"Mango Blast",mrp:5,pcs:30,boxMrp:150,retailMargin:0.16,ssRate:130.00,distMargin:0.12,distRate:116.16,unitInCrate:6},
  {id:35,srNo:35,category:"Ice Candy",ml:"40 ML",name:"Kala Khatta",mrp:5,pcs:30,boxMrp:150,retailMargin:0.16,ssRate:130.00,distMargin:0.12,distRate:116.16,unitInCrate:6},
  {id:36,srNo:36,category:"Kulfi",ml:"25 ML",name:"Mini Mava",mrp:5,pcs:30,boxMrp:150,retailMargin:0.16,ssRate:130.00,distMargin:0.12,distRate:116.16,unitInCrate:6},
  {id:37,srNo:37,category:"Kulfi",ml:"35 ML",name:"Mawa",mrp:10,pcs:30,boxMrp:300,retailMargin:0.25,ssRate:240.00,distMargin:0.12,distRate:213.78,unitInCrate:6},
  {id:38,srNo:38,category:"Kulfi",ml:"35 ML",name:"Pista",mrp:10,pcs:30,boxMrp:300,retailMargin:0.25,ssRate:240.00,distMargin:0.12,distRate:213.78,unitInCrate:6},
  {id:39,srNo:39,category:"Kulfi",ml:"35 ML",name:"Gulkand",mrp:10,pcs:30,boxMrp:300,retailMargin:0.25,ssRate:240.00,distMargin:0.12,distRate:213.78,unitInCrate:6},
  {id:40,srNo:40,category:"Premium Kulfi",ml:"70 ML",name:"Raj Bhog",mrp:20,pcs:18,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.14,distRate:264.70,unitInCrate:6},
  {id:41,srNo:41,category:"Premium Kulfi",ml:"70 ML",name:"Badam Masti",mrp:20,pcs:18,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.14,distRate:264.70,unitInCrate:6},
  {id:42,srNo:42,category:"Premium Kulfi",ml:"70 ML",name:"Shahi Pista",mrp:20,pcs:18,boxMrp:360,retailMargin:0.20,ssRate:300.00,distMargin:0.14,distRate:264.70,unitInCrate:12},
  {id:43,srNo:43,category:"Punjabi Kulfi",ml:"55 ML",name:"Rabdi",mrp:30,pcs:10,boxMrp:300,retailMargin:0.24,ssRate:241.40,distMargin:0.14,distRate:211.76,unitInCrate:12},
  {id:44,srNo:44,category:"Punjabi Kulfi",ml:"55 ML",name:"Dryfruit",mrp:30,pcs:10,boxMrp:300,retailMargin:0.24,ssRate:241.40,distMargin:0.14,distRate:211.76,unitInCrate:12},
  {id:45,srNo:45,category:"Punjabi Kulfi",ml:"55 ML",name:"Punjabi",mrp:30,pcs:10,boxMrp:300,retailMargin:0.24,ssRate:241.40,distMargin:0.14,distRate:211.76,unitInCrate:12},
  {id:46,srNo:46,category:"Punjabi Kulfi",ml:"55 ML",name:"Anjeer Badam",mrp:30,pcs:10,boxMrp:300,retailMargin:0.24,ssRate:241.40,distMargin:0.14,distRate:211.76,unitInCrate:6},
  {id:47,srNo:47,category:"Choco Blast",ml:"40 ML",name:"Mini Crunchy Chocobar",mrp:10,pcs:30,boxMrp:300,retailMargin:0.20,ssRate:250.00,distMargin:0.12,distRate:222.68,unitInCrate:6},
  {id:48,srNo:48,category:"Choco Blast",ml:"70 ML",name:"Big Crunchy",mrp:20,pcs:18,boxMrp:360,retailMargin:0.30,ssRate:278.00,distMargin:0.14,distRate:344.34,unitInCrate:6},
  {id:49,srNo:49,category:"Choco Blast",ml:"70 ML",name:"Choco Nutty",mrp:20,pcs:18,boxMrp:360,retailMargin:0.30,ssRate:278.00,distMargin:0.14,distRate:344.34,unitInCrate:6},
  {id:50,srNo:50,category:"Choco Blast",ml:"70 ML",name:"Choco Butter Bite",mrp:20,pcs:18,boxMrp:360,retailMargin:0.30,ssRate:278.00,distMargin:0.14,distRate:344.34,unitInCrate:6},
  {id:51,srNo:51,category:"Choco Blast",ml:"70 ML",name:"Choco Feast",mrp:30,pcs:18,boxMrp:540,retailMargin:0.30,ssRate:417.00,distMargin:0.14,distRate:366.51,unitInCrate:6},
  {id:52,srNo:52,category:"Choco Blast",ml:"70 ML",name:"Choco Almond",mrp:30,pcs:18,boxMrp:540,retailMargin:0.30,ssRate:417.00,distMargin:0.14,distRate:366.51,unitInCrate:8},
  {id:53,srNo:53,category:"Matka",ml:"90 ML",name:"Rajwadi Matka Kulfi",mrp:20,pcs:12,boxMrp:240,retailMargin:0.15,ssRate:208.00,distMargin:0.12,distRate:185.86,unitInCrate:8},
  {id:54,srNo:54,category:"Matka",ml:"100 ML",name:"Shahi Matka",mrp:50,pcs:6,boxMrp:300,retailMargin:0.30,ssRate:232.00,distMargin:0.14,distRate:203.61,unitInCrate:8},
  {id:55,srNo:55,category:"Sunday",ml:"60 ML",name:"Mix Fruit",mrp:10,pcs:12,boxMrp:120,retailMargin:0.16,ssRate:103.45,distMargin:0.12,distRate:92.86,unitInCrate:6},
  {id:56,srNo:56,category:"Sunday",ml:"100 ML",name:"Chocolate Ripple",mrp:20,pcs:12,boxMrp:240,retailMargin:0.25,ssRate:193.00,distMargin:0.14,distRate:169.40,unitInCrate:6},
  {id:57,srNo:57,category:"Sunday",ml:"100 ML",name:"Mango Ripple",mrp:20,pcs:12,boxMrp:240,retailMargin:0.25,ssRate:193.00,distMargin:0.14,distRate:169.40,unitInCrate:6},
  {id:58,srNo:58,category:"Sunday",ml:"125 ML",name:"Rajbhog",mrp:40,pcs:6,boxMrp:240,retailMargin:0.30,ssRate:185.69,distMargin:0.14,distRate:162.89,unitInCrate:6},
  {id:59,srNo:59,category:"Sunday",ml:"125 ML",name:"American Dryfruits",mrp:40,pcs:6,boxMrp:240,retailMargin:0.30,ssRate:185.69,distMargin:0.14,distRate:162.89,unitInCrate:6},
  {id:60,srNo:60,category:"Sunday",ml:"125 ML",name:"Fully Loaded",mrp:40,pcs:6,boxMrp:240,retailMargin:0.30,ssRate:185.69,distMargin:0.14,distRate:162.89,unitInCrate:8},
  {id:61,srNo:61,category:"Novelties",ml:"80 ML",name:"Sandwich",mrp:25,pcs:9,boxMrp:225,retailMargin:0.25,ssRate:180.00,distMargin:0.12,distRate:160.71,unitInCrate:8},
  {id:62,srNo:62,category:"Novelties",ml:"120 ML",name:"Cassata",mrp:50,pcs:6,boxMrp:300,retailMargin:0.30,ssRate:230.77,distMargin:0.12,distRate:206.04,unitInCrate:8},
  {id:63,srNo:63,category:"Roll Cut",ml:"100 ML",name:"Mawa Malai",mrp:40,pcs:6,boxMrp:240,retailMargin:0.30,ssRate:184.62,distMargin:0.14,distRate:161.94,unitInCrate:8},
  {id:64,srNo:64,category:"Roll Cut",ml:"100 ML",name:"Kesar Pista",mrp:40,pcs:6,boxMrp:240,retailMargin:0.30,ssRate:184.62,distMargin:0.14,distRate:161.94,unitInCrate:8},
  {id:65,srNo:65,category:"Family Pack",ml:"700 ML",name:"Vanilla",mrp:100,pcs:1,boxMrp:100,retailMargin:0.25,ssRate:79.97,distMargin:0.14,distRate:70.15,unitInCrate:30},
  {id:66,srNo:66,category:"Family Pack",ml:"700 ML",name:"Strawberry",mrp:100,pcs:1,boxMrp:100,retailMargin:0.25,ssRate:79.97,distMargin:0.14,distRate:70.15,unitInCrate:30},
  {id:67,srNo:67,category:"Family Pack",ml:"700 ML",name:"Badam",mrp:100,pcs:1,boxMrp:100,retailMargin:0.25,ssRate:79.97,distMargin:0.14,distRate:70.15,unitInCrate:30},
  {id:68,srNo:68,category:"Family Pack",ml:"700 ML",name:"Pista",mrp:100,pcs:1,boxMrp:100,retailMargin:0.25,ssRate:79.97,distMargin:0.14,distRate:70.15,unitInCrate:30},
  {id:69,srNo:69,category:"Family Pack",ml:"700 ML",name:"Tutti Frutti",mrp:130,pcs:1,boxMrp:130,retailMargin:0.30,ssRate:99.97,distMargin:0.14,distRate:87.70,unitInCrate:30},
  {id:70,srNo:70,category:"Family Pack",ml:"700 ML",name:"Butter Scotch",mrp:130,pcs:1,boxMrp:130,retailMargin:0.30,ssRate:99.97,distMargin:0.14,distRate:87.70,unitInCrate:30},
  {id:71,srNo:71,category:"Family Pack",ml:"700 ML",name:"Mango",mrp:130,pcs:1,boxMrp:130,retailMargin:0.30,ssRate:99.97,distMargin:0.14,distRate:87.70,unitInCrate:30},
  {id:72,srNo:72,category:"Family Pack",ml:"700 ML",name:"Chocolate Fudge",mrp:130,pcs:1,boxMrp:130,retailMargin:0.30,ssRate:99.97,distMargin:0.14,distRate:87.70,unitInCrate:30},
  {id:73,srNo:73,category:"Family Pack",ml:"700 ML",name:"Kaju KishMish",mrp:140,pcs:1,boxMrp:140,retailMargin:0.30,ssRate:107.66,distMargin:0.14,distRate:94.44,unitInCrate:30},
  {id:74,srNo:74,category:"Family Pack",ml:"700 ML",name:"Chocolate Chips",mrp:140,pcs:1,boxMrp:140,retailMargin:0.30,ssRate:107.66,distMargin:0.14,distRate:94.44,unitInCrate:30},
  {id:75,srNo:75,category:"Family Pack",ml:"700 ML",name:"Tender Coconut",mrp:150,pcs:1,boxMrp:150,retailMargin:0.30,ssRate:115.36,distMargin:0.14,distRate:101.20,unitInCrate:30},
  {id:76,srNo:76,category:"Family Pack",ml:"700 ML",name:"American Nuts",mrp:150,pcs:1,boxMrp:150,retailMargin:0.30,ssRate:115.36,distMargin:0.14,distRate:101.20,unitInCrate:30},
  {id:77,srNo:77,category:"Family Pack",ml:"700 ML",name:"Dryfruit Malai Kulfi",mrp:150,pcs:1,boxMrp:150,retailMargin:0.30,ssRate:115.36,distMargin:0.14,distRate:101.20,unitInCrate:30},
  {id:78,srNo:78,category:"Family Pack",ml:"700 ML",name:"Rajbhog",mrp:150,pcs:1,boxMrp:150,retailMargin:0.30,ssRate:115.36,distMargin:0.14,distRate:101.20,unitInCrate:30},
  {id:79,srNo:79,category:"Family Pack",ml:"700 ML",name:"Kesar Pista",mrp:150,pcs:1,boxMrp:150,retailMargin:0.30,ssRate:115.36,distMargin:0.14,distRate:101.20,unitInCrate:30},
  {id:80,srNo:80,category:"Family Pack",ml:"700 ML",name:"Sitaphal",mrp:150,pcs:1,boxMrp:150,retailMargin:0.30,ssRate:115.36,distMargin:0.14,distRate:101.20,unitInCrate:25},
  {id:81,srNo:81,category:"Party Pack",ml:"1250 ML",name:"Vanilla",mrp:140,pcs:1,boxMrp:140,retailMargin:0.30,ssRate:107.66,distMargin:0.14,distRate:94.44,unitInCrate:25},
  {id:82,srNo:82,category:"Party Pack",ml:"1250 ML",name:"Strawberry",mrp:140,pcs:1,boxMrp:140,retailMargin:0.30,ssRate:107.66,distMargin:0.14,distRate:94.44,unitInCrate:25},
  {id:83,srNo:83,category:"Party Pack",ml:"1250 ML",name:"Pista",mrp:140,pcs:1,boxMrp:140,retailMargin:0.30,ssRate:107.66,distMargin:0.14,distRate:94.44,unitInCrate:25},
  {id:84,srNo:84,category:"Party Pack",ml:"1250 ML",name:"Mango",mrp:170,pcs:1,boxMrp:170,retailMargin:0.30,ssRate:130.74,distMargin:0.14,distRate:114.69,unitInCrate:25},
  {id:85,srNo:85,category:"Party Pack",ml:"1250 ML",name:"Butter Scotch",mrp:170,pcs:1,boxMrp:170,retailMargin:0.30,ssRate:130.74,distMargin:0.14,distRate:114.69,unitInCrate:25},
  {id:86,srNo:86,category:"Party Pack",ml:"1250 ML",name:"Chocolate",mrp:170,pcs:1,boxMrp:170,retailMargin:0.30,ssRate:130.74,distMargin:0.14,distRate:114.69,unitInCrate:25},
  {id:87,srNo:87,category:"Party Pack",ml:"1250 ML",name:"Dryfruit Malai Kulfi",mrp:220,pcs:1,boxMrp:220,retailMargin:0.30,ssRate:169.23,distMargin:0.14,distRate:148.45,unitInCrate:25},
  {id:88,srNo:88,category:"Party Pack",ml:"1250 ML",name:"American Nuts",mrp:220,pcs:1,boxMrp:220,retailMargin:0.30,ssRate:169.23,distMargin:0.14,distRate:148.45,unitInCrate:25},
  {id:89,srNo:89,category:"Party Pack",ml:"1250 ML",name:"Rajbhog",mrp:220,pcs:1,boxMrp:220,retailMargin:0.30,ssRate:169.23,distMargin:0.14,distRate:148.45,unitInCrate:6},
  {id:90,srNo:90,category:"Catering Pack",ml:"5 LTR",name:"Vanilla",mrp:450,pcs:1,boxMrp:450,retailMargin:0.35,ssRate:333.26,distMargin:0.14,distRate:292.34,unitInCrate:6},
  {id:91,srNo:91,category:"Catering Pack",ml:"5 LTR",name:"Strawberry",mrp:450,pcs:1,boxMrp:450,retailMargin:0.35,ssRate:333.26,distMargin:0.14,distRate:292.34,unitInCrate:6},
  {id:92,srNo:92,category:"Catering Pack",ml:"5 LTR",name:"Pista",mrp:450,pcs:1,boxMrp:450,retailMargin:0.35,ssRate:333.26,distMargin:0.14,distRate:292.34,unitInCrate:6},
  {id:93,srNo:93,category:"Catering Pack",ml:"5 LTR",name:"Mango",mrp:650,pcs:1,boxMrp:650,retailMargin:0.35,ssRate:481.39,distMargin:0.14,distRate:422.28,unitInCrate:6},
  {id:94,srNo:94,category:"Catering Pack",ml:"5 LTR",name:"Butter Scotch",mrp:650,pcs:1,boxMrp:650,retailMargin:0.35,ssRate:481.39,distMargin:0.14,distRate:422.28,unitInCrate:6},
  {id:95,srNo:95,category:"Catering Pack",ml:"5 LTR",name:"Chocolate",mrp:650,pcs:1,boxMrp:650,retailMargin:0.35,ssRate:481.39,distMargin:0.14,distRate:422.28,unitInCrate:6},
  {id:96,srNo:96,category:"Bulk Pack",ml:"4 LTR",name:"Vanilla",mrp:350,pcs:1,boxMrp:350,retailMargin:0.35,ssRate:259.26,distMargin:0.14,distRate:227.42,unitInCrate:6},
  {id:97,srNo:97,category:"Bulk Pack",ml:"4 LTR",name:"Pista",mrp:350,pcs:1,boxMrp:350,retailMargin:0.35,ssRate:259.26,distMargin:0.14,distRate:227.42,unitInCrate:6},
  {id:98,srNo:98,category:"Bulk Pack",ml:"4 LTR",name:"Strawberry",mrp:350,pcs:1,boxMrp:350,retailMargin:0.35,ssRate:259.26,distMargin:0.14,distRate:227.42,unitInCrate:6},
  {id:99,srNo:99,category:"Bulk Pack",ml:"4 LTR",name:"Badam",mrp:350,pcs:1,boxMrp:350,retailMargin:0.35,ssRate:259.26,distMargin:0.14,distRate:227.42,unitInCrate:6},
  {id:100,srNo:100,category:"Bulk Pack",ml:"4 LTR",name:"Pineapple",mrp:350,pcs:1,boxMrp:350,retailMargin:0.35,ssRate:259.26,distMargin:0.14,distRate:227.42,unitInCrate:6},
  {id:101,srNo:101,category:"Bulk Pack",ml:"4 LTR",name:"Mango",mrp:500,pcs:1,boxMrp:500,retailMargin:0.35,ssRate:370.37,distMargin:0.14,distRate:324.89,unitInCrate:6},
  {id:102,srNo:102,category:"Bulk Pack",ml:"4 LTR",name:"Butterscotch",mrp:500,pcs:1,boxMrp:500,retailMargin:0.35,ssRate:370.37,distMargin:0.14,distRate:324.89,unitInCrate:6},
  {id:103,srNo:103,category:"Bulk Pack",ml:"4 LTR",name:"Chocolate",mrp:500,pcs:1,boxMrp:500,retailMargin:0.35,ssRate:370.37,distMargin:0.14,distRate:324.89,unitInCrate:6},
  {id:104,srNo:104,category:"Bulk Pack",ml:"4 LTR",name:"Tutti Frutti",mrp:500,pcs:1,boxMrp:500,retailMargin:0.35,ssRate:370.37,distMargin:0.14,distRate:324.89,unitInCrate:6},
  {id:105,srNo:105,category:"Bulk Pack",ml:"4 LTR",name:"Choco Chips",mrp:600,pcs:1,boxMrp:600,retailMargin:0.35,ssRate:444.44,distMargin:0.14,distRate:389.86,unitInCrate:6},
  {id:106,srNo:106,category:"Bulk Pack",ml:"4 LTR",name:"Coffee Co",mrp:650,pcs:1,boxMrp:650,retailMargin:0.35,ssRate:481.48,distMargin:0.14,distRate:422.35,unitInCrate:6},
  {id:107,srNo:107,category:"Bulk Pack",ml:"4 LTR",name:"Black Current",mrp:650,pcs:1,boxMrp:650,retailMargin:0.35,ssRate:481.48,distMargin:0.14,distRate:422.35,unitInCrate:6},
  {id:108,srNo:108,category:"Bulk Pack",ml:"4 LTR",name:"Gulkand",mrp:650,pcs:1,boxMrp:650,retailMargin:0.35,ssRate:481.48,distMargin:0.14,distRate:422.35,unitInCrate:6},
  {id:109,srNo:109,category:"Bulk Pack",ml:"4 LTR",name:"American Nuts",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:110,srNo:110,category:"Bulk Pack",ml:"4 LTR",name:"Rajbhog",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:111,srNo:111,category:"Bulk Pack",ml:"4 LTR",name:"Dryfruit Malai",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:112,srNo:112,category:"Bulk Pack",ml:"4 LTR",name:"Kesar Pista",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:113,srNo:113,category:"Bulk Pack",ml:"4 LTR",name:"Sitaphal",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:114,srNo:114,category:"Bulk Pack",ml:"4 LTR",name:"Tender Coconut",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:115,srNo:115,category:"Bulk Pack",ml:"4 LTR",name:"Roasted Almond",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:116,srNo:116,category:"Bulk Pack",ml:"4 LTR",name:"Spicy Guava",mrp:700,pcs:1,boxMrp:700,retailMargin:0.35,ssRate:518.52,distMargin:0.14,distRate:454.84,unitInCrate:6},
  {id:117,srNo:117,category:"Sunday Tub",ml:"500 ML",name:"Chocolate Ripple",mrp:100,pcs:1,boxMrp:100,retailMargin:0.25,ssRate:80.00,distMargin:0.14,distRate:70.18,unitInCrate:30},
  {id:118,srNo:118,category:"Sunday Tub",ml:"500 ML",name:"Mango Ripple",mrp:100,pcs:1,boxMrp:100,retailMargin:0.25,ssRate:80.00,distMargin:0.14,distRate:70.18,unitInCrate:30},
  {id:119,srNo:119,category:"Take Home Tub",ml:"750 ML",name:"American Nuts",mrp:190,pcs:1,boxMrp:190,retailMargin:0.25,ssRate:151.97,distMargin:0.14,distRate:133.31,unitInCrate:24},
  {id:120,srNo:120,category:"Take Home Tub",ml:"750 ML",name:"Rajbhog",mrp:190,pcs:1,boxMrp:190,retailMargin:0.25,ssRate:151.97,distMargin:0.14,distRate:133.31,unitInCrate:24},
  {id:121,srNo:121,category:"Take Home Tub",ml:"750 ML",name:"Belgium Chocolate",mrp:190,pcs:1,boxMrp:190,retailMargin:0.25,ssRate:151.97,distMargin:0.14,distRate:133.31,unitInCrate:24},
  {id:122,srNo:122,category:"Take Home Tub",ml:"750 ML",name:"Dryfruit Malai Kulfi",mrp:190,pcs:1,boxMrp:190,retailMargin:0.25,ssRate:151.97,distMargin:0.14,distRate:133.31,unitInCrate:24},
  {id:123,srNo:123,category:"Take Home Tub",ml:"750 ML",name:"Mango MahaRaja",mrp:160,pcs:1,boxMrp:160,retailMargin:0.25,ssRate:127.97,distMargin:0.14,distRate:112.26,unitInCrate:24},
  {id:124,srNo:124,category:"Take Home Tub",ml:"750 ML",name:"Butter Scotch",mrp:160,pcs:1,boxMrp:160,retailMargin:0.25,ssRate:127.97,distMargin:0.14,distRate:112.26,unitInCrate:24},
  {id:125,srNo:125,category:"Cake",ml:"500 ML",name:"BlackForest Cake",mrp:250,pcs:1,boxMrp:250,retailMargin:0.25,ssRate:200.00,distMargin:0.14,distRate:175.44,unitInCrate:24},
  {id:126,srNo:126,category:"Cake",ml:"500 ML",name:"Golden Fancy Cake",mrp:250,pcs:1,boxMrp:250,retailMargin:0.25,ssRate:200.00,distMargin:0.14,distRate:175.44,unitInCrate:24},
];

const CAT_EMOJI = {"Big Cup":"🍦","Boat Cups":"🛶","Premium Cups":"✨","Small Cup":"🥛","Small Cone":"🍦","Medium Cone":"🍧","Big Cone":"🍦","Ice Candy":"🧊","Kulfi":"🍡","Premium Kulfi":"⭐","Punjabi Kulfi":"🥛","Choco Blast":"🍫","Matka":"🏺","Sunday":"🌈","Novelties":"🎉","Roll Cut":"🎂","Family Pack":"👨‍👩‍👧‍👦","Party Pack":"🎊","Bulk Pack":"📦","Catering Pack":"🍽️","Sunday Tub":"🪣","Take Home Tub":"🏠","Cake":"🎂"};
const CAT_COLOR = {"Big Cup":"#FF6B9D","Boat Cups":"#4ECDC4","Premium Cups":"#9B59B6","Small Cup":"#F39C12","Small Cone":"#E74C3C","Medium Cone":"#3498DB","Big Cone":"#2ECC71","Ice Candy":"#1ABC9C","Kulfi":"#E67E22","Premium Kulfi":"#8E44AD","Punjabi Kulfi":"#C0392B","Choco Blast":"#6D4C41","Matka":"#D35400","Sunday":"#F1C40F","Novelties":"#16A085","Roll Cut":"#27AE60","Family Pack":"#2980B9","Party Pack":"#8E44AD","Bulk Pack":"#7F8C8D","Catering Pack":"#546E7A","Sunday Tub":"#A1887F","Take Home Tub":"#5C6BC0","Cake":"#E91E63"};

// ============================================================
// MOCK DATABASE (simulates MongoDB collections)
// ============================================================
function createDB() {
  const store = {};
  return {
    find: (col, query={}) => {
      const docs = store[col] || [];
      return docs.filter(d => Object.entries(query).every(([k,v]) => d[k]===v));
    },
    findOne: (col, query={}) => {
      const docs = store[col] || [];
      return docs.find(d => Object.entries(query).every(([k,v]) => d[k]===v)) || null;
    },
    insert: (col, doc) => {
      if(!store[col]) store[col]=[];
      const _id = col+"_"+Date.now()+"_"+Math.random().toString(36).substr(2,5);
      const newDoc = {...doc, _id};
      store[col].push(newDoc);
      return newDoc;
    },
    update: (col, query, update) => {
      if(!store[col]) return;
      store[col] = store[col].map(d => {
        if(Object.entries(query).every(([k,v])=>d[k]===v)) return {...d,...update};
        return d;
      });
    },
    delete: (col, query) => {
      if(!store[col]) return;
      store[col] = store[col].filter(d => !Object.entries(query).every(([k,v])=>d[k]===v));
    },
    getAll: (col) => store[col] || [],
    seed: (col, docs) => { store[col] = docs; }
  };
}

const DB = createDB();

// Seed initial data
DB.seed("users", [
  {_id:"u_manager1", name:"Rajesh Sharma", role:"manager", email:"manager@scoopLovers.com", password:"manager123", phone:"9822001001", district:"All", status:"active", createdAt: Date.now()},
  {_id:"u_ss1", name:"Pragati Sales", role:"ss", email:"pragati@ss.com", password:"ss123", phone:"9822001002", district:"Nagpur", status:"active", ssId:null, createdAt: Date.now()},
  {_id:"u_dist1", name:"Mahesh Distributors", role:"distributor", email:"mahesh@dist.com", password:"dist123", phone:"9822001003", district:"Nagpur", status:"active", ssId:"u_ss1", createdAt: Date.now()},
  {_id:"u_retail1", name:"Vijay Sweets Corner", role:"retailer", email:"vijay@retail.com", password:"retail123", phone:"9822001004", district:"Nagpur", status:"active", distId:"u_dist1", ssId:"u_ss1", createdAt: Date.now()},
]);
DB.seed("products", PRODUCTS_DEFAULT);
DB.seed("orders", []);
DB.seed("notifications", []);

// ============================================================
// EXCEL GENERATOR (pure JS, no external lib needed)
// Generates a proper CSV-based .xlsx compatible download
// ============================================================
function generateOrderExcel(order, allProducts, viewerRole) {
  if (!window.XLSX) {
    alert("Excel library (SheetJS) is not loaded. Please check your internet connection.");
    return;
  }

  const XLSX = window.XLSX;
  const wb = XLSX.utils.book_new();
  const isDistView = viewerRole === "distributor" || viewerRole === "retailer";
  const marginLabel = isDistView ? "Dist Margin" : "SS Margin";
  const rateLabel = isDistView ? "Dist RATE" : "SS Rate";

  const now = new Date(order.createdAt);
  const dateStr = now.toLocaleDateString("en-IN");

  // Build ordered items map by productId
  const orderMap = {};
  order.items.forEach(item => { orderMap[item.productId] = item; });

  // Title row: party name + district (e.g. "PRAGATI SALES NAGPUR")
  const partyName = (order.placedByName || "ORDER").toUpperCase() + " " + (order.district || "").toUpperCase();

  // Column headers matching the Excel template format
  const headers = [
    "SR NO", "Category", "ML", "Product Name", "MRP", "Pcs",
    "Box Mrp", marginLabel, rateLabel,
    "Unit in Crate", "Number of Crate", "Pieces", "Order Amount"
  ];

  // Build sheet data as array-of-arrays — include ALL products
  const aoa = [];
  aoa.push([partyName]); // Row 0: merged title
  aoa.push(headers);     // Row 1: column headers

  let totalCrates = 0;
  let totalPieces = 0;
  let grandTotal = 0;

  allProducts.forEach(p => {
    const item = orderMap[p.id];
    const margin = isDistView ? (p.distMargin || 0) : (p.retailMargin || 0);
    const rate = isDistView ? p.distRate : p.ssRate;
    const numCrates = item ? item.cartons : 0;
    const pieces = numCrates * (p.unitInCrate || 0);
    const amount = numCrates > 0 ? rate * pieces : 0;

    if (numCrates > 0) {
      totalCrates += numCrates;
      totalPieces += pieces;
      grandTotal += amount;
    }

    aoa.push([
      p.srNo || "",
      p.category || "",
      p.ml || "",
      p.name || "",
      p.mrp,
      p.pcs,
      p.boxMrp,
      (margin * 100).toFixed(1) + "%",
      rate,
      p.unitInCrate,
      numCrates > 0 ? numCrates : "",
      numCrates > 0 ? pieces : 0,
      numCrates > 0 ? amount : "-"
    ]);
  });

  // Totals & footer
  aoa.push([]);
  aoa.push(["", "", "", "", "", "", "", "", "Grand Total", "", totalCrates, totalPieces, grandTotal]);
  aoa.push([]);
  aoa.push(["Scoop Lovers | Cremino's Milk Products LLP | www.scoopLovers.in"]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Merge title row across all 13 columns
  if (!ws["!merges"]) ws["!merges"] = [];
  ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 12 } });

  // Apply number formats to data rows for clean display
  const dataStartRow = 2; // 0-indexed (title=0, headers=1, data starts at row 2)
  const dataEndRow = dataStartRow + allProducts.length;
  for (let r = dataStartRow; r < dataEndRow; r++) {
    // MRP column (col 4): Rupee format
    const mrpRef = XLSX.utils.encode_cell({ r, c: 4 });
    if (ws[mrpRef] && typeof ws[mrpRef].v === "number") ws[mrpRef].z = "\"₹ \"#,##0";
    // Rate column (col 8): 2 decimal places
    const rateRef = XLSX.utils.encode_cell({ r, c: 8 });
    if (ws[rateRef] && typeof ws[rateRef].v === "number") ws[rateRef].z = "#,##0.00";
    // Unit in Crate (col 9): 2 decimal places
    const uicRef = XLSX.utils.encode_cell({ r, c: 9 });
    if (ws[uicRef] && typeof ws[uicRef].v === "number") ws[uicRef].z = "0.00";
    // Number of Crate (col 10): 2 decimal places
    const nocRef = XLSX.utils.encode_cell({ r, c: 10 });
    if (ws[nocRef] && typeof ws[nocRef].v === "number") ws[nocRef].z = "0.00";
    // Order Amount (col 12): comma-separated with 2 decimals
    const amtRef = XLSX.utils.encode_cell({ r, c: 12 });
    if (ws[amtRef] && typeof ws[amtRef].v === "number") ws[amtRef].z = "#,##0.00";
  }

  // Format grand total amount row
  const totalRowIdx = dataEndRow + 1;
  const gtRef = XLSX.utils.encode_cell({ r: totalRowIdx, c: 12 });
  if (ws[gtRef] && typeof ws[gtRef].v === "number") ws[gtRef].z = "#,##0.00";

  // Set column widths to prevent ##### display in Excel
  ws["!cols"] = [
    { wch: 7 },   // A: SR NO
    { wch: 16 },  // B: Category
    { wch: 9 },   // C: ML
    { wch: 24 },  // D: Product Name
    { wch: 8 },   // E: MRP
    { wch: 6 },   // F: Pcs
    { wch: 9 },   // G: Box Mrp
    { wch: 12 },  // H: Margin
    { wch: 12 },  // I: Rate
    { wch: 12 },  // J: Unit in Crate
    { wch: 16 },  // K: Number of Crate
    { wch: 9 },   // L: Pieces
    { wch: 15 },  // M: Order Amount
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Order");
  XLSX.writeFile(wb, `ScoopLovers_Order_${order.id}_${dateStr.replace(/\//g, "-")}.xlsx`);
}

// ============================================================
// PARSE UPLOADED EXCEL (manager uploads new rate sheet)
// ============================================================
function parseCSVTo2DArray(text) {
  // Auto-detect delimiter
  let delimiter = ",";
  const firstLine = text.split("\n")[0] || "";
  if (firstLine.includes(";")) {
    delimiter = ";";
  } else if (firstLine.includes("\t")) {
    delimiter = "\t";
  }
  
  const rows = [];
  let row = [];
  let inQuotes = false;
  let cell = "";
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        cell += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      row.push(cell);
      if (row.some(Boolean) || row.length > 0) {
        rows.push(row);
      }
      row = [];
      cell = "";
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
    } else {
      cell += char;
    }
  }
  
  // Push last cell/row
  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  
  return rows;
}

function parseRawSheetData(rows) {
  if (!rows || rows.length === 0) return null;
  
  // Clean empty rows and columns; normalize newlines/carriage-returns to spaces
  const cleanRows = rows.map(r =>
    (r || []).map(c => String(c || "").replace(/[\r\n]+/g, " ").trim())
  ).filter(r => r.some(Boolean));
  if (cleanRows.length === 0) return null;

  // Step 1: Find header row by searching for "SR NO" (case-insensitive)
  let headerIdx = -1;
  for (let i = 0; i < cleanRows.length; i++) {
    const row = cleanRows[i];
    const firstCell = String(row[0] || "").toLowerCase().trim();
    if (firstCell === "sr no" || firstCell === "sr. no" || firstCell === "srno") {
      headerIdx = i;
      break;
    }
  }

  // Step 2: If SR NO not found, try the old scoring method for backward compatibility
  let maxCols = Math.max(...cleanRows.map(r => r.length));
  
  if (headerIdx === -1) {
    // Old method: score-based header detection
    const nameSynonyms = ["product name", "productname", "name", "product", "item", "item name", "particulars", "particular", "desc", "description", "flavor", "flavour"];
    const catSynonyms = ["category", "cat", "group", "type", "class"];
    const mlSynonyms = ["ml", "size", "volume", "qty", "capacity", "ml/box", "pack size"];
    const ssKeys = ["retail rate", "ss rate", "ssrate", "retailrate", "ss margin rate", "ss price", "ssprice", "retail margin price", "retail margin rate", "ss rate", "retail"];
    const distKeys = ["dist rate", "distrate", "distributor rate", "distributorrate", "dist price", "distprice", "distributor price", "distributorprice", "dist rate"];
    const genericKeys = ["rate", "price", "amount", "val", "cost", "value"];

    let maxScore = -1;
    for (let i = 0; i < Math.min(cleanRows.length, 20); i++) {
      const row = cleanRows[i];
      let hasName = false;
      let score = 0;
      
      row.forEach(cell => {
        const c = cell.toLowerCase().trim();
        if (nameSynonyms.some(s => c === s || c.includes(s) || s.includes(c))) {
          hasName = true;
          score += 5;
        }
        if (catSynonyms.some(s => c === s || c.includes(s) || s.includes(c))) {
          score += 3;
        }
        if (ssKeys.concat(distKeys, genericKeys).some(s => c === s || c.includes(s) || s.includes(c))) {
          score += 2;
        }
      });
      
      if (hasName && score > maxScore) {
        maxScore = score;
        headerIdx = i;
      }
    }
  }

  // If still no header found, allow file to upload with preview
  if (headerIdx === -1) {
    console.log("[v0] No SR NO or standard header found - showing preview mode");
    // Return raw data for preview
    return cleanRows.map((row, idx) => {
      const obj = {};
      row.forEach((cell, j) => {
        obj[`column_${j}`] = cell;
      });
      return obj;
    });
  }

  // Step 3: Dynamic column mapping based on header row
  const headerRow = cleanRows[headerIdx];
  
  let nameColIdx = -1;
  let catColIdx = -1;
  let qtyColIdx = -1;
  let rateColIdx = -1;
  let amountColIdx = -1;

  // Map columns dynamically based on header
  headerRow.forEach((cell, j) => {
    const c = cell.toLowerCase().trim();
    
    if (nameColIdx === -1 && (c === "product name" || c === "product" || c === "name" || c === "particulars")) {
      nameColIdx = j;
    }
    if (catColIdx === -1 && (c === "category" || c === "cat" || c === "group" || c === "type")) {
      catColIdx = j;
    }
    if (qtyColIdx === -1 && (c === "quantity" || c === "qty" || c === "volume" || c === "ml")) {
      qtyColIdx = j;
    }
    if (rateColIdx === -1 && (c === "rate" || c === "price" || c === "ss rate" || c === "dist rate" || c === "mrp")) {
      rateColIdx = j;
    }
    if (amountColIdx === -1 && (c === "amount" || c === "total" || c === "value" || c === "cost")) {
      amountColIdx = j;
    }
  });

  // Build headers dynamically from the header row
  const headers = Array(maxCols).fill("");
  for (let j = 0; j < maxCols; j++) {
    if (j === nameColIdx) headers[j] = "product name";
    else if (j === catColIdx) headers[j] = "category";
    else if (j === qtyColIdx) headers[j] = "quantity";
    else if (j === rateColIdx) headers[j] = "rate";
    else if (j === amountColIdx) headers[j] = "amount";
    else if (headerRow[j]) {
      headers[j] = String(headerRow[j]).toLowerCase().trim().replace(/['"]/g, "");
    } else {
      headers[j] = `column_${j}`;
    }
  }

  // Step 4: Read all rows after header until end
  const parsed = [];
  const startRowIdx = headerIdx + 1;

  for (let i = startRowIdx; i < cleanRows.length; i++) {
    const row = cleanRows[i];
    
    // Skip completely empty rows
    if (!row.some(Boolean)) continue;

    const rowData = {};
    for (let j = 0; j < headers.length; j++) {
      if (headers[j]) {
        rowData[headers[j]] = row[j] || "";
      }
    }

    // Only include if it has a product name
    const nameVal = rowData["product name"];
    if (nameVal && nameVal.trim() && nameVal.toLowerCase() !== "sr no") {
      parsed.push(rowData);
    }
  }

  return parsed.length > 0 ? parsed : null;
}

function parseUploadedCSV(text) {
  const rows = parseCSVTo2DArray(text);
  return parseRawSheetData(rows);
}

function extractRateValue(row, uploadType) {
  const ssKeys = ["retail rate", "ss rate", "ssrate", "retailrate", "ss margin rate", "ss price", "ssprice", "retail margin price", "retail margin rate"];
  const distKeys = ["dist rate", "distrate", "distributor rate", "distributorrate", "dist price", "distprice", "distributor price", "distributorprice"];
  const genericKeys = ["rate", "price", "amount", "mrp", "val", "cost", "value"];
  
  const keys = Object.keys(row);
  
  if (uploadType === "ss") {
    // Try to find an SS key
    const ssKey = keys.find(k => ssKeys.some(sk => k.includes(sk) || sk.includes(k)));
    if (ssKey) {
      const val = parseFloat(String(row[ssKey]).replace(/[^0-9.]/g, ""));
      if (!isNaN(val)) return val;
    }
  } else {
    // Try to find a distributor key
    const distKey = keys.find(k => distKeys.some(dk => k.includes(dk) || dk.includes(k)));
    if (distKey) {
      const val = parseFloat(String(row[distKey]).replace(/[^0-9.]/g, ""));
      if (!isNaN(val)) return val;
    }
  }
  
  // Fallback to generic rates
  const genKey = keys.find(k => genericKeys.some(gk => k === gk || k.includes(gk)));
  if (genKey) {
    const val = parseFloat(String(row[genKey]).replace(/[^0-9.]/g, ""));
    if (!isNaN(val)) return val;
  }
  
  return 0;
}

// ============================================================
// NOTIFICATION HELPER
// ============================================================
function pushNotif(icon, title, message, targetUserId="all") {
  DB.insert("notifications", {icon, title, message, targetUserId, time: new Date().toLocaleString("en-IN"), read: false});
}

// ============================================================
// UI HELPERS
// ============================================================
function genOrderId(){return "SL-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).substr(2,4).toUpperCase();}

function StatusBadge({status}){
  const C={Draft:{bg:"#E0E0E0",tx:"#555"},Pending:{bg:"#FFF3CD",tx:"#856404"},Approved:{bg:"#D1ECF1",tx:"#0C5460"},Processing:{bg:"#CCE5FF",tx:"#004085"},Dispatched:{bg:"#E2D9F3",tx:"#6F42C1"},Delivered:{bg:"#D4EDDA",tx:"#155724"},Cancelled:{bg:"#F8D7DA",tx:"#721C24"}};
  const c=C[status]||C.Draft;
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:c.bg,color:c.tx}}>{status}</span>;
}

function Card({children, style={}}){
  return <div style={{background:"white",borderRadius:14,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid #F0F0F0",...style}}>{children}</div>;
}

function StatCard({icon,label,value,color="#4FC3F7",sub}){
  return(
    <div style={{background:"white",borderRadius:14,padding:18,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`1.5px solid ${color}22`}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <p style={{margin:0,color:"#888",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{label}</p>
          <p style={{margin:"6px 0 0",fontSize:26,fontWeight:800,color:"#1A237E"}}>{value}</p>
          {sub&&<p style={{margin:"3px 0 0",fontSize:11,color:"#AAA"}}>{sub}</p>}
        </div>
        <div style={{width:44,height:44,borderRadius:22,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div>
      </div>
    </div>
  );
}

function Modal({open, onClose, title, children, width=500}){
  if(!open) return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:16}}>
      <div style={{background:"white",borderRadius:18,padding:28,width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(0,0,0,0.35)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,fontSize:18,fontWeight:700,color:"#1A237E"}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#888"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Btn({children,onClick,variant="primary",disabled=false,small=false,style={}}){
  const variants={
    primary:{bg:"linear-gradient(135deg,#1A237E,#7B1FA2)",color:"white",border:"none"},
    secondary:{bg:"#F5F5F5",color:"#444",border:"1px solid #DDD"},
    danger:{bg:"#FFEBEE",color:"#C62828",border:"1px solid #FFCDD2"},
    success:{bg:"#E8F5E9",color:"#2E7D32",border:"1px solid #C8E6C9"},
    warning:{bg:"#FFF8E1",color:"#E65100",border:"1px solid #FFE082"},
  };
  const v=variants[variant]||variants.primary;
  return(
    <button onClick={onClick} disabled={disabled} style={{
      padding:small?"6px 12px":"10px 18px",borderRadius:9,background:v.bg,color:v.color,
      border:v.border,cursor:disabled?"not-allowed":"pointer",fontWeight:600,
      fontSize:small?12:13,opacity:disabled?.5:1,...style
    }}>{children}</button>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({onLogin}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const [showPass,setShowPass]=useState(false);

  const demos=[
    {label:"Manager",email:"manager@scoopLovers.com",pass:"manager123"},
    {label:"Super Stockist",email:"pragati@ss.com",pass:"ss123"},
    {label:"Distributor",email:"mahesh@dist.com",pass:"dist123"},
    {label:"Retailer",email:"vijay@retail.com",pass:"retail123"},
  ];

  function doLogin(em,pw){
    const user=DB.findOne("users",{email:em});
    if(user&&user.password===pw&&user.status==="active"){onLogin(user);}
    else setErr("Invalid credentials or account disabled.");
  }

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0D1B6E 0%,#3F51B5 50%,#7B1FA2 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'Poppins','Segoe UI',sans-serif"}}>
      <div style={{width:"100%",maxWidth:460}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:76,height:76,borderRadius:38,background:"white",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,boxShadow:"0 8px 28px rgba(0,0,0,0.3)"}}>🍦</div>
          <h1 style={{color:"white",margin:0,fontSize:26,fontWeight:800}}>Scoop Lovers</h1>
          <p style={{color:"rgba(255,255,255,0.65)",margin:"4px 0 0",fontSize:13}}>Order Management System</p>
        </div>
        <div style={{background:"white",borderRadius:20,padding:30,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          <h2 style={{margin:"0 0 22px",fontSize:19,fontWeight:700,color:"#1A237E"}}>Sign In</h2>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,fontWeight:700,color:"#555",display:"block",marginBottom:5}}>Email Address</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter email" type="email" className="modern-input"
              style={{width:"100%",padding:"10px 13px",borderRadius:9,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{fontSize:12,fontWeight:700,color:"#555",display:"block",marginBottom:5}}>Password</label>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>setPassword(e.target.value)} type={showPass?"text":"password"} placeholder="Enter password" className="modern-input"
                style={{width:"100%",padding:"10px 38px 10px 13px",borderRadius:9,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setShowPass(!showPass)} type="button" style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:17}}>
                {showPass?"🙈":"👁"}
              </button>
            </div>
          </div>
          {err&&<div style={{background:"#FFEBEE",color:"#C62828",padding:"8px 12px",borderRadius:8,fontSize:12,marginBottom:12}}>{err}</div>}
          <Btn onClick={()=>doLogin(email,password)} style={{width:"100%",padding:"12px",fontSize:14}}>Sign In →</Btn>
          <div style={{marginTop:22,borderTop:"1px solid #F0F0F0",paddingTop:18}}>
            <p style={{fontSize:11,color:"#888",textAlign:"center",margin:"0 0 10px"}}>Quick demo access:</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {demos.map(d=>(
                <button key={d.label} onClick={()=>{setEmail(d.email);setPassword(d.pass);doLogin(d.email,d.pass);}}
                  style={{padding:"7px 10px",background:"#F3F4F6",border:"1px solid #E5E7EB",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:600,color:"#374151"}}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p style={{color:"rgba(255,255,255,0.45)",textAlign:"center",marginTop:14,fontSize:11}}>Cremino's Milk Products LLP · Chhatrapati Sambhajinagar</p>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({role,user,active,setActive,onLogout,cartCount,notifCount}){
  const items={
    manager:[{id:"dashboard",icon:"🏠",label:"Dashboard"},{id:"products",icon:"🍦",label:"Products"},{id:"orders",icon:"📋",label:"All Orders"},{id:"users",icon:"👥",label:"Manage Users"},{id:"upload",icon:"⬆️",label:"Upload Rate Sheet"},{id:"notifications",icon:"🔔",label:"Notifications"}],
    ss:[{id:"dashboard",icon:"🏠",label:"Dashboard"},{id:"products",icon:"🍦",label:"Products"},{id:"basket",icon:"🛒",label:"Basket"},{id:"orders",icon:"📋",label:"Orders"},{id:"notifications",icon:"🔔",label:"Notifications"}],
    distributor:[{id:"dashboard",icon:"🏠",label:"Dashboard"},{id:"products",icon:"🍦",label:"Products"},{id:"basket",icon:"🛒",label:"Basket"},{id:"orders",icon:"📋",label:"Orders"},{id:"notifications",icon:"🔔",label:"Notifications"}],
    retailer:[{id:"dashboard",icon:"🏠",label:"Dashboard"},{id:"products",icon:"🍦",label:"Products"},{id:"basket",icon:"🛒",label:"Basket"},{id:"orders",icon:"📋",label:"Orders"},{id:"notifications",icon:"🔔",label:"Notifications"}],
  };
  const roleColor={manager:"#FFD700",ss:"#4FC3F7",distributor:"#A5D6A7",retailer:"#FFAB91"};
  const roleLabel={manager:"Manager",ss:"Super Stockist",distributor:"Distributor",retailer:"Retailer"};

  return(
    <div style={{width:"100%",height:"100vh",flexShrink:0,background:"linear-gradient(180deg,#0A1648 0%,#1A237E 50%,#283593 100%)",display:"flex",flexDirection:"column",fontFamily:"'Poppins','Segoe UI',sans-serif",overflow:"hidden",position:"fixed",left:0,top:0,zIndex:500}}>
      <div style={{padding:"22px 18px 14px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:38,height:38,borderRadius:19,background:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🍦</div>
          <div><div style={{color:"white",fontWeight:800,fontSize:13}}>Scoop Lovers</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:9}}>OMS v2.0</div></div>
        </div>
      </div>
      <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
        <div style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 11px"}}>
          <div style={{color:"white",fontWeight:700,fontSize:12,marginBottom:3}}>{user.name}</div>
          <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:roleColor[role]+"33",color:roleColor[role],border:`1px solid ${roleColor[role]}55`}}>{roleLabel[role]}</span>
          {user.district&&user.district!=="All"&&<div style={{color:"rgba(255,255,255,0.5)",fontSize:10,marginTop:3}}>📍 {user.district}</div>}
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 10px",overflowY:"auto"}}>
        {(items[role]||[]).map(item=>{
          const badge=(item.id==="basket"&&cartCount>0)?cartCount:(item.id==="notifications"&&notifCount>0)?notifCount:0;
          return(
            <button key={item.id} onClick={()=>setActive(item.id)} style={{
              width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"9px 11px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:3,
              background:active===item.id?"rgba(255,255,255,0.18)":"transparent",
              color:active===item.id?"white":"rgba(255,255,255,0.6)",
              fontWeight:active===item.id?700:400,fontSize:12
            }}>
              <span style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:16}}>{item.icon}</span>{item.label}</span>
              {badge>0&&<span style={{background:"#FF6B9D",color:"white",fontSize:10,fontWeight:800,borderRadius:10,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"10px 10px 22px"}}>
        <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,border:"none",cursor:"pointer",background:"rgba(255,80,80,0.18)",color:"#FF8A80",fontSize:12,fontWeight:700}}>🚪 Logout</button>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({role,user,refreshKey}){
  const orders=DB.getAll("orders");
  const myOrders=role==="manager"?orders:orders.filter(o=>o.placedBy===user._id);
  const pending=myOrders.filter(o=>o.status==="Pending").length;
  const delivered=myOrders.filter(o=>o.status==="Delivered").length;
  const revenue=myOrders.reduce((s,o)=>s+o.grandTotal,0);
  const users=DB.getAll("users");
  const ssCount=users.filter(u=>u.role==="ss"&&u.status==="active").length;
  const distCount=users.filter(u=>u.role==="distributor"&&u.status==="active").length;
  const retailCount=users.filter(u=>u.role==="retailer"&&u.status==="active").length;

  const statsByRole={
    manager:[{icon:"🏬",label:"Super Stockists",value:ssCount,color:"#4FC3F7"},{icon:"🚚",label:"Distributors",value:distCount,color:"#81C784"},{icon:"🛍️",label:"Retailers",value:retailCount,color:"#FFB74D"},{icon:"📋",label:"Total Orders",value:orders.length,color:"#FF6B9D"}],
    ss:[{icon:"🚚",label:"My Distributors",value:users.filter(u=>u.role==="distributor"&&u.ssId===user._id&&u.status==="active").length,color:"#81C784"},{icon:"⏳",label:"Pending",value:pending,color:"#FFB74D"},{icon:"✅",label:"Delivered",value:delivered,color:"#4FC3F7"},{icon:"💰",label:"Revenue",value:"₹"+revenue.toFixed(0),color:"#FF6B9D"}],
    distributor:[{icon:"📋",label:"My Orders",value:myOrders.length,color:"#4FC3F7"},{icon:"⏳",label:"Pending",value:pending,color:"#FFB74D"},{icon:"✅",label:"Delivered",value:delivered,color:"#81C784"},{icon:"💰",label:"Total Value",value:"₹"+revenue.toFixed(0),color:"#FF6B9D"}],
    retailer:[{icon:"📋",label:"Orders Placed",value:myOrders.length,color:"#4FC3F7"},{icon:"⏳",label:"Pending",value:pending,color:"#FFB74D"},{icon:"✅",label:"Delivered",value:delivered,color:"#81C784"},{icon:"💰",label:"Total Spent",value:"₹"+revenue.toFixed(0),color:"#FF6B9D"}],
  };
  const recentOrders=[...myOrders].sort((a,b)=>b.createdAt-a.createdAt).slice(0,6);

  return(
    <div>
      <div style={{marginBottom:22}}>
        <h2 style={{margin:0,fontSize:21,fontWeight:800,color:"#1A237E"}}>Welcome, {user.name}! 👋</h2>
        <p style={{margin:"4px 0 0",color:"#888",fontSize:13}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>
      <div className="stats-grid">
        {(statsByRole[role]||[]).map((s,i)=><StatCard key={i} {...s}/>)}
      </div>
      <Card>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:"#1A237E"}}>Recent Orders</h3>
        {recentOrders.length===0?(
          <div style={{textAlign:"center",padding:"32px 0",color:"#CCC"}}><div style={{fontSize:36,marginBottom:8}}>📋</div><p style={{margin:0,fontSize:13}}>No orders yet</p></div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#F8F9FA"}}>
                {["Order ID","Party","Items","Grand Total","Status","Date"].map(h=>(
                  <th key={h} style={{padding:"9px 11px",textAlign:"left",color:"#666",fontWeight:700,borderBottom:"1px solid #EEE"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{recentOrders.map(o=>(
                <tr key={o._id} style={{borderBottom:"1px solid #F5F5F5"}}>
                  <td style={{padding:"9px 11px",fontWeight:700,color:"#1A237E",fontSize:11}}>{o.id}</td>
                  <td style={{padding:"9px 11px",color:"#555"}}>{o.placedByName}</td>
                  <td style={{padding:"9px 11px",color:"#777"}}>{o.items.length}</td>
                  <td style={{padding:"9px 11px",fontWeight:700,color:"#2E7D32"}}>₹{o.grandTotal.toFixed(2)}</td>
                  <td style={{padding:"9px 11px"}}><StatusBadge status={o.status}/></td>
                  <td style={{padding:"9px 11px",color:"#888",fontSize:11}}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// PRODUCT CATALOG
// ============================================================
function ProductImg({category,size=50}){
  const emoji=CAT_EMOJI[category]||"🍨";
  const color=CAT_COLOR[category]||"#FF6B9D";
  return <div style={{width:size,height:size,borderRadius:size/2,background:color+"22",border:`2px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.44,flexShrink:0}}>{emoji}</div>;
}

function ProductCatalog({role,user,cart,setCart}){
  const [catFilter,setCatFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [qty,setQty]=useState(1);
  const products=DB.getAll("products");
  const cats=[...new Set(products.map(p=>p.category))];

  const filtered=products.filter(p=>{
    const c=catFilter==="All"||p.category===catFilter;
    const s=!search||p.name.toLowerCase().includes(search.toLowerCase())||p.category.toLowerCase().includes(search.toLowerCase());
    return c&&s;
  });

  const grouped=cats.reduce((acc,cat)=>{
    const items=filtered.filter(p=>p.category===cat);
    if(items.length>0) acc[cat]=items;
    return acc;
  },{});

  function getRate(p){return role==="distributor"||role==="retailer"?p.distRate:p.ssRate;}

  function openModal(p){
    setModal(p);
    const ex=cart.find(c=>c.productId===p.id);
    setQty(ex?ex.cartons:1);
  }

  function addToCart(){
    if(!modal) return;
    const p=modal;
    const cartons=Math.max(1,parseInt(qty)||1);
    const rate=getRate(p);
    const amount=rate*p.unitInCrate*cartons;
    setCart(prev=>{
      const ex=prev.find(c=>c.productId===p.id);
      const item={productId:p.id,name:p.name,category:p.category,ml:p.ml,pcs:p.pcs,unitInCrate:p.unitInCrate,boxMrp:p.boxMrp,cartons,totalUnits:cartons*p.unitInCrate*p.pcs,ssRate:p.ssRate,distRate:p.distRate,rate,amount};
      if(ex) return prev.map(c=>c.productId===p.id?item:c);
      return [...prev,item];
    });
    setModal(null);
  }

  const cartIds=new Set(cart.map(c=>c.productId));

  return(
    <div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:18,alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products..."
          style={{flex:1,minWidth:180,padding:"9px 13px",border:"1.5px solid #E0E0E0",borderRadius:9,fontSize:13,outline:"none"}}/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
          style={{padding:"9px 13px",border:"1.5px solid #E0E0E0",borderRadius:9,fontSize:13,background:"white"}}>
          <option value="All">All Categories ({products.length})</option>
          {cats.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        {cart.length>0&&<div style={{background:"linear-gradient(135deg,#FF6B9D,#FF4081)",color:"white",padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:800}}>🛒 {cart.length} in basket</div>}
      </div>

      {Object.entries(grouped).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:26}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontSize:20}}>{CAT_EMOJI[cat]||"🍦"}</span>
            <h3 style={{margin:0,fontSize:15,fontWeight:800,color:"#1A237E"}}>{cat}</h3>
            <span style={{fontSize:11,color:"#888",background:"#F0F0F0",padding:"2px 7px",borderRadius:20}}>{items.length}</span>
          </div>
          <div className="catalog-grid">
            {items.map(p=>{
              const inCart=cartIds.has(p.id);
              const color=CAT_COLOR[p.category]||"#FF6B9D";
              return(
                <div key={p.id} onClick={()=>openModal(p)} className="card-hover" style={{background:"white",borderRadius:12,padding:13,cursor:"pointer",border:inCart?`2px solid ${color}`:"1.5px solid #F0F0F0",position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  {inCart&&<div style={{position:"absolute",top:7,right:7,width:18,height:18,borderRadius:9,background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"white",fontWeight:900}}>✓</div>}
                  <ProductImg category={p.category} size={46}/>
                  <p style={{margin:"9px 0 1px",fontWeight:700,fontSize:12,color:"#1A237E"}}>{p.name}</p>
                  <p style={{margin:0,fontSize:10,color:"#AAA"}}>{p.ml} · {p.pcs} pcs/box</p>
                  <div style={{marginTop:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:800,color:"#2E7D32"}}>₹{getRate(p).toFixed(2)}</span>
                    <span style={{fontSize:10,color:"#CCC"}}>MRP ₹{p.mrp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"#BBB"}}><div style={{fontSize:44,marginBottom:10}}>🔍</div><p>No products found</p></div>}

      <Modal open={!!modal} onClose={()=>setModal(null)} title="Add to Basket">
        {modal&&(
          <div>
            <div style={{display:"flex",gap:14,marginBottom:18}}>
              <ProductImg category={modal.category} size={68}/>
              <div>
                <p style={{margin:0,fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:1}}>{modal.category}</p>
                <h3 style={{margin:"3px 0",fontSize:18,fontWeight:800,color:"#1A237E"}}>{modal.name}</h3>
                <p style={{margin:0,color:"#888",fontSize:12}}>{modal.ml} · SR#{modal.srNo}</p>
              </div>
            </div>
            <div style={{background:"#F8F9FD",borderRadius:10,padding:14,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Pcs Per Box",modal.pcs],["Box MRP","₹"+modal.boxMrp],["SS Rate","₹"+modal.ssRate.toFixed(2)],["Dist Rate","₹"+modal.distRate.toFixed(2)],["Units/Crate",modal.unitInCrate],["MRP/Pc","₹"+modal.mrp]].map(([k,v])=>(
                <div key={k}><p style={{margin:0,fontSize:10,color:"#888"}}>{k}</p><p style={{margin:"2px 0 0",fontSize:13,fontWeight:700,color:"#1A237E"}}>{v}</p></div>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:700,color:"#555",display:"block",marginBottom:6}}>Number of Cartons</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:34,height:34,borderRadius:17,border:"1.5px solid #DDD",background:"white",cursor:"pointer",fontSize:18}}>−</button>
                <input type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))}
                  style={{flex:1,textAlign:"center",padding:"8px",border:"1.5px solid #DDD",borderRadius:9,fontSize:15,fontWeight:800}}/>
                <button onClick={()=>setQty(qty+1)} style={{width:34,height:34,borderRadius:17,border:"1.5px solid #DDD",background:"white",cursor:"pointer",fontSize:18}}>+</button>
              </div>
            </div>
            <div style={{background:"#E8F5E9",borderRadius:10,padding:12,marginBottom:18,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["Total Units",qty*modal.unitInCrate*modal.pcs],["No. of Boxes",qty*modal.unitInCrate],["Order Amt","₹"+(getRate(modal)*modal.unitInCrate*qty).toFixed(2)]].map(([k,v])=>(
                <div key={k}><p style={{margin:0,fontSize:10,color:"#555"}}>{k}</p><p style={{margin:"2px 0 0",fontWeight:800,color:"#2E7D32",fontSize:13}}>{v}</p></div>
              ))}
            </div>
            <div style={{display:"flex",gap:9}}>
              <Btn variant="secondary" onClick={()=>setModal(null)} style={{flex:1}}>Cancel</Btn>
              <Btn onClick={addToCart} style={{flex:2}}>🛒 Add to Basket</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================
// BASKET
// ============================================================
function Basket({role,user,cart,setCart,onConfirm}){
  const products=DB.getAll("products");

  function getRate(item){return role==="distributor"||role==="retailer"?item.distRate:item.ssRate;}
  function updateQty(productId,cartons){
    setCart(prev=>prev.map(c=>{
      if(c.productId!==productId)return c;
      const p=products.find(p=>p.id===productId);
      const rate=getRate(c);
      return{...c,cartons,totalUnits:cartons*c.unitInCrate*c.pcs,amount:rate*c.unitInCrate*cartons};
    }));
  }
  function remove(productId){setCart(prev=>prev.filter(c=>c.productId!==productId));}

  const grandTotal=cart.reduce((s,item)=>s+getRate(item)*item.unitInCrate*item.cartons,0);
  const totalCartons=cart.reduce((s,i)=>s+i.cartons,0);
  const totalUnits=cart.reduce((s,i)=>s+i.cartons*i.unitInCrate*i.pcs,0);
  const marginLabel=role==="distributor"||role==="retailer"?"Dist Rate":"SS Rate";

  if(cart.length===0) return(
    <div style={{textAlign:"center",padding:"70px 0"}}>
      <div style={{fontSize:60,marginBottom:14}}>🛒</div>
      <h3 style={{color:"#1A237E",margin:"0 0 6px"}}>Basket is empty</h3>
      <p style={{color:"#AAA",fontSize:13}}>Browse Products to add items</p>
    </div>
  );

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#1A237E"}}>🛒 Order Basket <span style={{fontSize:14,color:"#888",fontWeight:400}}>({cart.length} products)</span></h2>
      </div>
      {/* Desktop Table View */}
      <div className="desktop-table-view">
        <Card style={{marginBottom:16,padding:0,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#1A237E"}}>
                {["#","Product","Category","ML","Cartons","Boxes","Total Units",marginLabel,"Amount",""].map(h=>(
                  <th key={h} style={{padding:"11px 10px",color:"white",fontWeight:700,textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{cart.map((item,idx)=>{
                const rate=getRate(item);
                const amount=rate*item.unitInCrate*item.cartons;
                return(
                  <tr key={item.productId} style={{borderBottom:"1px solid #F5F5F5"}}>
                    <td style={{padding:"9px 10px",color:"#AAA"}}>{idx+1}</td>
                    <td style={{padding:"9px 10px",fontWeight:700,color:"#1A237E"}}>{item.name}</td>
                    <td style={{padding:"9px 10px",color:"#666"}}>{item.category}</td>
                    <td style={{padding:"9px 10px",color:"#888"}}>{item.ml}</td>
                    <td style={{padding:"9px 10px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <button onClick={()=>updateQty(item.productId,Math.max(1,item.cartons-1))} style={{width:20,height:20,borderRadius:10,border:"1px solid #DDD",background:"white",cursor:"pointer",fontSize:13,lineHeight:1}}>−</button>
                        <span style={{width:26,textAlign:"center",fontWeight:800}}>{item.cartons}</span>
                        <button onClick={()=>updateQty(item.productId,item.cartons+1)} style={{width:20,height:20,borderRadius:10,border:"1px solid #DDD",background:"white",cursor:"pointer",fontSize:13,lineHeight:1}}>+</button>
                      </div>
                    </td>
                    <td style={{padding:"9px 10px",color:"#555"}}>{item.cartons*item.unitInCrate}</td>
                    <td style={{padding:"9px 10px",color:"#555"}}>{item.cartons*item.unitInCrate*item.pcs}</td>
                    <td style={{padding:"9px 10px",color:"#555"}}>₹{rate.toFixed(2)}</td>
                    <td style={{padding:"9px 10px",fontWeight:800,color:"#2E7D32"}}>₹{amount.toFixed(2)}</td>
                    <td style={{padding:"9px 10px"}}>
                      <button onClick={()=>remove(item.productId)} style={{background:"#FFEBEE",border:"none",borderRadius:6,padding:"3px 7px",cursor:"pointer",color:"#E53935",fontSize:12}}>🗑️</button>
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards-view" style={{ marginBottom: 16 }}>
        {cart.map((item) => {
          const rate = getRate(item);
          const amount = rate * item.unitInCrate * item.cartons;
          return (
            <div key={item.productId} className="mobile-order-item-card">
              <div className="mobile-order-item-header">
                <div>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1A237E" }}>{item.name}</h4>
                  <span style={{ fontSize: 10, color: "#888" }}>{item.category} · {item.ml}</span>
                </div>
                <button onClick={() => remove(item.productId)} style={{ background: "#FFEBEE", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#E53935", fontSize: 12 }}>🗑️ Delete</button>
              </div>
              <div className="mobile-order-item-details">
                <div className="mobile-order-item-detail-row">
                  <span className="mobile-order-item-label">Cartons</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <button onClick={() => updateQty(item.productId, Math.max(1, item.cartons - 1))} style={{ width: 24, height: 24, borderRadius: 12, border: "1px solid #DDD", background: "white", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ minWidth: 20, textAlign: "center", fontWeight: 800, fontSize: 13 }}>{item.cartons}</span>
                    <button onClick={() => updateQty(item.productId, item.cartons + 1)} style={{ width: 24, height: 24, borderRadius: 12, border: "1px solid #DDD", background: "white", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
                <div className="mobile-order-item-detail-row">
                  <span className="mobile-order-item-label">Boxes / Pcs</span>
                  <span className="mobile-order-item-value" style={{ marginTop: 6, display: "block" }}>
                    {item.cartons * item.unitInCrate} bx / {item.cartons * item.unitInCrate * item.pcs} pcs
                  </span>
                </div>
                <div className="mobile-order-item-detail-row">
                  <span className="mobile-order-item-label">Rate</span>
                  <span className="mobile-order-item-value" style={{ marginTop: 6, display: "block" }}>₹{rate.toFixed(2)}</span>
                </div>
                <div className="mobile-order-item-detail-row">
                  <span className="mobile-order-item-label">Subtotal</span>
                  <span className="mobile-order-item-value" style={{ marginTop: 6, display: "block", color: "#2E7D32", fontWeight: 800 }}>₹{amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{background:"linear-gradient(135deg,#0D1B6E,#7B1FA2)",borderRadius:14,padding:22,color:"white"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:18,marginBottom:18}}>
          {[["Total Cartons",totalCartons],["Total Units",totalUnits.toLocaleString("en-IN")],["Grand Total","₹"+grandTotal.toFixed(2)]].map(([k,v])=>(
            <div key={k}><p style={{margin:0,opacity:.65,fontSize:11}}>{k}</p><p style={{margin:"4px 0 0",fontSize:k==="Grand Total"?24:20,fontWeight:800}}>{v}</p></div>
          ))}
        </div>
        <button onClick={()=>onConfirm(cart,grandTotal)} style={{width:"100%",padding:"13px",background:"rgba(255,255,255,0.18)",border:"2px solid rgba(255,255,255,0.35)",borderRadius:11,color:"white",fontSize:15,fontWeight:800,cursor:"pointer"}}>
          ✅ Confirm & Submit Order
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS LIST  (with Excel download button per order)
// ============================================================
function OrdersList({role,user,refreshKey}){
  const [filter,setFilter]=useState("All");
  const [expandedId,setExpandedId]=useState(null);
  const allOrders=DB.getAll("orders");
  const products=DB.getAll("products");

  let myOrders=allOrders;
  if(role==="ss") myOrders=allOrders.filter(o=>o.ssId===user._id||o.placedBy===user._id);
  if(role==="distributor") myOrders=allOrders.filter(o=>o.placedBy===user._id||o.distId===user._id);
  if(role==="retailer") myOrders=allOrders.filter(o=>o.placedBy===user._id);

  const statuses=["All","Draft","Completed"];
  const filtered=filter==="All"?myOrders:myOrders.filter(o=>o.status===filter);
  const sorted=[...filtered].sort((a,b)=>b.createdAt-a.createdAt);

  function changeStatus(orderId,status){
    DB.update("orders",{id:orderId},{status});
    const o=DB.findOne("orders",{id:orderId});
    if(o){
      pushNotif("📦",`Order ${status}`,`Order ${orderId} has been ${status.toLowerCase()}`,o.placedBy);
    }
  }

  const nextStatus={Draft:["Completed"],Completed:[]};

  return(
    <div>
      <h2 style={{margin:"0 0 18px",fontSize:20,fontWeight:800,color:"#1A237E"}}>📋 {role==="manager"?"All Orders":"My Orders"} <span style={{fontSize:13,color:"#888",fontWeight:400}}>({sorted.length})</span></h2>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"5px 13px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:filter===s?"#1A237E":"#F0F0F0",color:filter===s?"white":"#555"}}>
            {s} {s!=="All"&&<span style={{opacity:.6}}>({allOrders.filter(o=>o.status===s).length})</span>}
          </button>
        ))}
      </div>

      {sorted.length===0?<div style={{textAlign:"center",padding:"50px 0",color:"#CCC"}}><div style={{fontSize:42}}>📭</div><p>No orders found</p></div>:(
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {sorted.map(order=>{
            const actions=(role==="manager"||(role==="ss"&&order.placedBy!==user._id))?nextStatus[order.status]||[]:[];
            const exp=expandedId===order._id;
            return(
              <div key={order._id} style={{background:"white",borderRadius:13,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",border:"1px solid #F0F0F0"}}>
                <div style={{padding:"15px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontWeight:800,color:"#1A237E",fontSize:13}}>{order.id}</span>
                        <StatusBadge status={order.status}/>
                        <span style={{fontSize:11,color:"#AAA"}}>by {order.placedByName}</span>
                      </div>
                      <p style={{margin:0,color:"#AAA",fontSize:11}}>{new Date(order.createdAt).toLocaleString("en-IN")} · {order.items.length} products · {order.district}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <p style={{margin:0,fontSize:19,fontWeight:800,color:"#2E7D32"}}>₹{order.grandTotal.toFixed(2)}</p>
                      <div style={{display:"flex",gap:6,marginTop:5,justifyContent:"flex-end"}}>
                        <Btn small variant="success" onClick={()=>generateOrderExcel(order,products,role)}>⬇️ Download Excel</Btn>
                        <Btn small variant="secondary" onClick={()=>setExpandedId(exp?null:order._id)}>{exp?"▲ Hide":"▼ Details"}</Btn>
                      </div>
                    </div>
                  </div>
                  {actions.length>0&&(
                    <div style={{display:"flex",gap:7,marginTop:12}}>
                      {actions.map(s=>(
                        <Btn key={s} small variant={s==="Cancelled"?"danger":"success"} onClick={()=>changeStatus(order.id,s)}>
                          {s==="Cancelled"?"✗ Cancel":"✓ "+s}
                        </Btn>
                      ))}
                    </div>
                  )}
                </div>
                {exp&&(
                  <div style={{borderTop:"1px solid #F5F5F5",padding:"14px 18px",background:"#FAFAFA"}}>
                    {/* Desktop View Table */}
                    <div className="desktop-table-view" style={{ overflowX: "auto" }}>
                      <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
                        <thead><tr style={{color:"#888"}}>
                          {["SR","Product","Category","ML","Pcs/Box","Box MRP","SS Margin","SS Rate","Dist Margin","Dist Rate","Cartons","Units","Amount"].map(h=>(
                            <th key={h} style={{padding:"6px 8px",textAlign:"left",fontWeight:700,borderBottom:"1px solid #EEE",whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>{order.items.map((item,i)=>{
                          const p=products.find(p=>p.id===item.productId)||{};
                          return(
                            <tr key={i} style={{borderTop:"1px solid #EEEEEE"}}>
                              <td style={{padding:"6px 8px",color:"#AAA"}}>{i+1}</td>
                              <td style={{padding:"6px 8px",fontWeight:700}}>{item.name}</td>
                              <td style={{padding:"6px 8px",color:"#666"}}>{item.category}</td>
                              <td style={{padding:"6px 8px",color:"#888"}}>{item.ml}</td>
                              <td style={{padding:"6px 8px",textAlign:"center"}}>{item.pcs}</td>
                              <td style={{padding:"6px 8px"}}>₹{item.boxMrp}</td>
                              <td style={{padding:"6px 8px",color:"#7B1FA2"}}>{p.retailMargin?(p.retailMargin*100).toFixed(1)+"%":"-"}</td>
                              <td style={{padding:"6px 8px",fontWeight:700,color:"#0D47A1"}}>₹{item.ssRate.toFixed(2)}</td>
                              <td style={{padding:"6px 8px",color:"#7B1FA2"}}>{p.distMargin?(p.distMargin*100).toFixed(1)+"%":"-"}</td>
                              <td style={{padding:"6px 8px",fontWeight:700,color:"#0D47A1"}}>₹{item.distRate.toFixed(2)}</td>
                              <td style={{padding:"6px 8px",textAlign:"center",fontWeight:700}}>{item.cartons}</td>
                              <td style={{padding:"6px 8px",textAlign:"center"}}>{item.totalUnits}</td>
                              <td style={{padding:"6px 8px",fontWeight:800,color:"#2E7D32"}}>₹{item.amount.toFixed(2)}</td>
                            </tr>
                          );
                        })}</tbody>
                        <tfoot><tr style={{background:"#F8F9FA",fontWeight:800}}>
                          <td colSpan={10} style={{padding:"8px",textAlign:"right",fontSize:12}}>GRAND TOTAL</td>
                          <td style={{padding:"8px",textAlign:"center"}}>{order.items.reduce((s,i)=>s+i.cartons,0)}</td>
                          <td style={{padding:"8px",textAlign:"center"}}>{order.items.reduce((s,i)=>s+i.totalUnits,0)}</td>
                          <td style={{padding:"8px",color:"#2E7D32",fontSize:13}}>₹{order.grandTotal.toFixed(2)}</td>
                        </tr></tfoot>
                      </table>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="mobile-cards-view" style={{ gap: 10 }}>
                      {order.items.map((item, i) => {
                        const p = products.find(p => p.id === item.productId) || {};
                        const isDistView = role === "distributor" || role === "retailer";
                        const margin = isDistView ? (p.distMargin || 0) : (p.retailMargin || 0);
                        const rate = isDistView ? item.distRate : item.ssRate;
                        return (
                          <div key={i} className="mobile-order-item-card" style={{ border: "1px solid #EAEAEA" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #EEE", paddingBottom: 6, marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, color: "#1A237E" }}>#{i+1} {item.name}</span>
                              <span style={{ fontSize: 10, color: "#888" }}>{item.category} ({item.ml})</span>
                            </div>
                            <div className="mobile-order-item-details">
                              <div className="mobile-order-item-detail-row">
                                <span className="mobile-order-item-label">Cartons</span>
                                <span className="mobile-order-item-value">{item.cartons} ctn</span>
                              </div>
                              <div className="mobile-order-item-detail-row">
                                <span className="mobile-order-item-label">Total Units</span>
                                <span className="mobile-order-item-value">{item.totalUnits} pcs ({item.unitInCrate * item.cartons} boxes)</span>
                              </div>
                              <div className="mobile-order-item-detail-row">
                                <span className="mobile-order-item-label">Margin</span>
                                <span className="mobile-order-item-value">{(margin * 100).toFixed(1)}%</span>
                              </div>
                              <div className="mobile-order-item-detail-row">
                                <span className="mobile-order-item-label">Rate</span>
                                <span className="mobile-order-item-value">₹{rate.toFixed(2)}</span>
                              </div>
                              <div className="mobile-order-item-price">
                                <span className="mobile-order-item-label">Subtotal</span>
                                <span style={{ fontWeight: 800, color: "#2E7D32" }}>₹{item.amount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ background: "#F3F4F6", borderRadius: 10, padding: 12, marginTop: 4, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, fontWeight: 700 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#666" }}>Total Cartons:</span>
                          <span style={{ color: "#1A237E" }}>{order.items.reduce((s, i) => s + i.cartons, 0)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#666" }}>Total Units:</span>
                          <span style={{ color: "#1A237E" }}>{order.items.reduce((s, i) => s + i.totalUnits, 0)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E0E0E0", paddingTop: 6, fontSize: 13 }}>
                          <span style={{ color: "#333" }}>GRAND TOTAL:</span>
                          <span style={{ color: "#2E7D32" }}>₹{order.grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MANAGE USERS  (Manager: create SS + distributors; SS: view only)
// ============================================================
function ManageUsers({role,user,refreshKey,setRefreshKey}){
  const [tab,setTab]=useState("ss");
  const [modal,setModal]=useState(null); // "add-ss"|"add-dist"
  const [form,setForm]=useState({});
  const [msg,setMsg]=useState("");

  const allUsers=DB.getAll("users");
  const ssList=allUsers.filter(u=>u.role==="ss");
  const distList=allUsers.filter(u=>u.role==="distributor");
  const retailList=allUsers.filter(u=>u.role==="retailer");

  function submit(){
    if(!form.email||!form.phone){setMsg("Email and phone are required.");return;}
    const foundUser=allUsers.find(u=>u.email===form.email&&u.phone===form.phone);
    if(!foundUser){setMsg("No user found with this email and phone combination.");return;}
    if(modal==="add-ss"&&foundUser.role!=="ss"){setMsg("This user is not registered as a Super Stockist.");return;}
    if(modal==="add-dist"&&foundUser.role!=="distributor"){setMsg("This user is not registered as a Distributor.");return;}
    pushNotif("✅","User Added",`${foundUser.name} (${foundUser.role}) has been verified and added`,"all");
    setModal(null);setForm({});setMsg("");
    setRefreshKey(k=>k+1);
  }

  function toggleStatus(userId){
    const u=DB.findOne("users",{_id:userId});
    if(!u)return;
    DB.update("users",{_id:userId},{status:u.status==="active"?"disabled":"active"});
    setRefreshKey(k=>k+1);
  }

  const tabs=[{id:"ss",label:"Super Stockists",data:ssList},{id:"dist",label:"Distributors",data:distList},{id:"retail",label:"Retailers",data:retailList}];

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#1A237E"}}>👥 Manage Users</h2>
        <div style={{display:"flex",gap:8}}>
          {role==="manager"&&<Btn small onClick={()=>{setModal("add-ss");setForm({});setMsg("");}}>+ Add SS</Btn>}
          {role==="manager"&&<Btn small variant="secondary" onClick={()=>{setModal("add-dist");setForm({});setMsg("");}}>+ Add Distributor</Btn>}
        </div>
      </div>

      <div style={{display:"flex",gap:7,marginBottom:16}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:tab===t.id?"#1A237E":"#F0F0F0",color:tab===t.id?"white":"#555"}}>{t.label} ({t.data.length})</button>)}
      </div>

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#1A237E"}}>
              {["Name","Email","Phone","District","SS/Dist","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"11px 13px",color:"white",textAlign:"left",fontWeight:700}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{(tabs.find(t=>t.id===tab)||{}).data?.map(u=>{
              const parentSS=u.ssId?allUsers.find(s=>s._id===u.ssId):null;
              return(
                <tr key={u._id} style={{borderBottom:"1px solid #F5F5F5"}}>
                  <td style={{padding:"11px 13px",fontWeight:700}}>{u.name}</td>
                  <td style={{padding:"11px 13px",color:"#555",fontSize:11}}>{u.email}</td>
                  <td style={{padding:"11px 13px",color:"#666"}}>{u.phone}</td>
                  <td style={{padding:"11px 13px",color:"#666"}}>{u.district}</td>
                  <td style={{padding:"11px 13px",color:"#888",fontSize:11}}>{parentSS?parentSS.name:"-"}</td>
                  <td style={{padding:"11px 13px"}}>
                    <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:u.status==="active"?"#D4EDDA":"#F8D7DA",color:u.status==="active"?"#155724":"#721C24"}}>{u.status}</span>
                  </td>
                  <td style={{padding:"11px 13px"}}>
                    {role==="manager"&&<Btn small variant={u.status==="active"?"danger":"success"} onClick={()=>toggleStatus(u._id)}>{u.status==="active"?"Disable":"Enable"}</Btn>}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!modal} onClose={()=>{setModal(null);setMsg("");}} title={modal==="add-ss"?"Add Super Stockist":"Add Distributor"}>
        <p style={{fontSize:12,color:"#666",marginBottom:15}}>Enter the email and phone number used during registration:</p>
        {["email","phone"].map(field=>(
          <div key={field} style={{marginBottom:13}}>
            <label style={{fontSize:12,fontWeight:700,color:"#555",display:"block",marginBottom:5,textTransform:"capitalize"}}>{field}</label>
            <input value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} type={field==="email"?"email":"tel"}
              placeholder={`Enter ${field}`} className="modern-input"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
        ))}
        {msg&&<div style={{background:"#FFEBEE",color:"#C62828",padding:"7px 11px",borderRadius:7,fontSize:12,marginBottom:12}}>{msg}</div>}
        <div style={{display:"flex",gap:9}}>
          <Btn variant="secondary" onClick={()=>{setModal(null);setMsg("");}} style={{flex:1}}>Cancel</Btn>
          <Btn onClick={submit} style={{flex:2}}>✅ Verify & Add</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// UPLOAD RATE SHEET (Manager only)
// ============================================================
function UploadRateSheet({setRefreshKey}){
  const [uploadType,setUploadType]=useState("ss"); // "ss" | "distributor"
  const [dragging,setDragging]=useState(false);
  const [status,setStatus]=useState("");
  const [preview,setPreview]=useState([]);
  const fileRef=useRef();

  function processFile(file){
    if(!file)return;
    const reader=new FileReader();
    const isXlsx = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    
    reader.onload=(e)=>{
      let parsed = null;
      if (isXlsx) {
        try {
          if (!window.XLSX) {
            setStatus("❌ Excel parsing library (SheetJS) is not loaded. Please ensure you have an active internet connection or upload a CSV file instead.");
            return;
          }
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, {type: 'array'});
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          // Convert sheet to JSON array of arrays
          const json = window.XLSX.utils.sheet_to_json(worksheet, {header: 1});
          parsed = parseRawSheetData(json);
        } catch (err) {
          setStatus("❌ Failed to parse Excel (.xlsx/.xls) file. Error: " + err.message);
          return;
        }
      } else {
        const text=e.target.result;
        parsed=parseUploadedCSV(text);
      }

      if(!parsed||parsed.length===0){
        setStatus("❌ Could not parse sheet. Please ensure it contains column headers like 'Product Name' and valid rate values.");
        setPreview([]);
        return;
      }
      const updated=parsed.slice(0,10); // preview first 10
      setPreview(updated);
      setStatus(`✅ Parsed ${parsed.length} rows. Review below then click Apply.`);
      window._parsedRates=parsed;
    };

    if (isXlsx) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }

  function applyRates(){
    const parsed=window._parsedRates;
    if(!parsed){return;}
    let updated=0;
    const currentProducts=DB.getAll("products");
    parsed.forEach(row=>{
      const keys = Object.keys(row);
      const nameSynonyms = ["product name", "productname", "name", "product", "item", "item name", "particulars", "particular"];
      const catSynonyms = ["category", "cat", "group", "type", "class"];
      const mlSynonyms = ["ml", "size", "volume", "qty", "capacity", "ml/box", "pack size"];
      
      const nameKey = keys.find(k => nameSynonyms.some(s => k === s || k.includes(s) || s.includes(k)));
      const catKey = keys.find(k => catSynonyms.some(s => k === s || k.includes(s) || s.includes(k)));
      const mlKey = keys.find(k => mlSynonyms.some(s => k === s || k.includes(s) || s.includes(k)));
      
      const name = nameKey ? String(row[nameKey]).trim().toLowerCase() : "";
      const cat = catKey ? String(row[catKey]).trim().toLowerCase() : "";
      const ml = mlKey ? String(row[mlKey]).trim().toLowerCase() : "";
      
      if(!name) return;
      
      const match = currentProducts.find(p => p.name.toLowerCase() === name && (!cat || p.category.toLowerCase() === cat) && (!ml || p.ml.toLowerCase() === ml));
      if(match){
        const rate = extractRateValue(row, uploadType);
        const updateObj = {};
        if (rate > 0) {
          if (uploadType === "ss") {
            updateObj.ssRate = rate;
          } else {
            updateObj.distRate = rate;
          }
        }
        // Detect and update margin columns
        const marginSynonyms = uploadType === "ss"
          ? ["ss margin", "retail margin", "retailmargin", "ssmargin"]
          : ["dist margin", "distributor margin", "distmargin", "distributormargin"];
        const marginKey = keys.find(k => marginSynonyms.some(s => k.includes(s) || s.includes(k)));
        if (marginKey) {
          const mRaw = parseFloat(String(row[marginKey]).replace(/[^0-9.]/g, ""));
          if (!isNaN(mRaw) && mRaw > 0 && mRaw <= 100) {
            if (uploadType === "ss") {
              updateObj.retailMargin = mRaw / 100;
            } else {
              updateObj.distMargin = mRaw / 100;
            }
          }
        }
        // Detect and update unit in crate column
        const crateSynonyms = ["unit in crate", "unitincrate", "units in crate", "crate unit", "unit/crate"];
        const crateKey = keys.find(k => crateSynonyms.some(s => k.includes(s) || s.includes(k)));
        if (crateKey) {
          const cVal = parseFloat(String(row[crateKey]).replace(/[^0-9.]/g, ""));
          if (!isNaN(cVal) && cVal > 0) {
            updateObj.unitInCrate = Math.round(cVal);
          }
        }
        if (Object.keys(updateObj).length > 0) {
          DB.update("products", {id: match.id}, updateObj);
          updated++;
        }
      }
    });
    setStatus(`✅ Updated ${updated} products with new ${uploadType === "ss" ? "Super Stockist (SS)" : "Distributor"} rates. Changes are live immediately.`);
    setPreview([]);
    setRefreshKey(k=>k+1);
    window._parsedRates=null;
  }

  return(
    <div>
      <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800,color:"#1A237E"}}>⬆️ Upload Rate Sheet</h2>
      <p style={{margin:"0 0 16px",color:"#888",fontSize:13}}>
        Upload an updated Excel spreadsheet (.xlsx, .xls) or CSV rate sheet to refresh product prices system-wide. Selecting the correct option will update the corresponding pricing logic for all orders.
      </p>

      {/* Upload Type Options */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button onClick={()=>{setUploadType("ss"); setStatus(""); setPreview([]);}} style={{
          padding:"8px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
          background:uploadType==="ss"?"#1A237E":"#E2E8F0",
          color:uploadType==="ss"?"white":"#475569",
          transition:"all 0.2s"
        }}>
          🍦 Option 1: Super Stockist (SS) Rates
        </button>
        <button onClick={()=>{setUploadType("distributor"); setStatus(""); setPreview([]);}} style={{
          padding:"8px 16px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
          background:uploadType==="distributor"?"#1A237E":"#E2E8F0",
          color:uploadType==="distributor"?"white":"#475569",
          transition:"all 0.2s"
        }}>
          🚚 Option 2: Distributor Rates
        </button>
      </div>

      <Card style={{marginBottom:16}}>
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)processFile(f);}}
          onClick={()=>fileRef.current.click()}
          style={{border:`2px dashed ${dragging?"#1A237E":"#CCC"}`,borderRadius:12,padding:"40px 20px",textAlign:"center",cursor:"pointer",background:dragging?"#E8EAF6":"#FAFAFA",transition:"all .2s"}}>
          <div style={{fontSize:44,marginBottom:10}}>📂</div>
          <p style={{margin:0,fontWeight:700,color:"#1A237E",fontSize:14}}>Drop Excel (.xlsx, .xls) or CSV file here or click to browse</p>
          <p style={{margin:"6px 0 0",color:"#AAA",fontSize:12}}>Uploading as: <strong>{uploadType === "ss" ? "Super Stockist (SS) Rates" : "Distributor Rates"}</strong></p>
          <input ref={fileRef} type="file" style={{display:"none"}} onChange={e=>processFile(e.target.files[0])}/>
        </div>
      </Card>

      <Card style={{marginBottom:16}}>
        <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#1A237E"}}>
          Expected Sheet Columns for {uploadType === "ss" ? "Super Stockist (SS)" : "Distributor"}
        </h3>
        <div style={{background:"#1A237E",borderRadius:8,padding:12,overflowX:"auto"}}>
          <code style={{color:"#81D4FA",fontSize:11,whiteSpace:"pre"}}>
            {uploadType === "ss" ? 
`Category | Product Name | Retail Rate (or SS Rate)
e.g. Big Cup, Vanilla, 194.96` :
`Category | Product Name | Dist Rate (or Distributor Rate)
e.g. Big Cup, Vanilla, 171.02`
            }
          </code>
        </div>
        <p style={{margin:"10px 0 0",fontSize:11,color:"#888"}}>
          {uploadType === "ss" ? 
            "Tip: Columns can be in any order. The sheet must contain a column for the product name and a column for the rate (Retail Rate, SS Rate, or Price)." :
            "Tip: Columns can be in any order. The sheet must contain a column for the product name and a column for the rate (Dist Rate, Distributor Rate, or Price)."
          }
        </p>
      </Card>

      {status&&(
        <div style={{padding:"10px 14px",borderRadius:9,marginBottom:14,background:status.startsWith("✅")?"#E8F5E9":"#FFEBEE",color:status.startsWith("✅")?"#2E7D32":"#C62828",fontSize:13,fontWeight:600}}>{status}</div>
      )}

      {preview.length>0&&(
        <Card style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#1A237E"}}>Preview (first 10 rows)</h3>
            <Btn onClick={applyRates}>✅ Apply Rates</Btn>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:"#F0F0F0"}}>
                {Object.keys(preview[0]).slice(0,8).map(h=><th key={h} style={{padding:"7px 9px",textAlign:"left",fontWeight:700,color:"#555"}}>{h}</th>)}
              </tr></thead>
              <tbody>{preview.map((row,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #F5F5F5"}}>
                  {Object.values(row).slice(0,8).map((v,j)=><td key={j} style={{padding:"7px 9px",color:"#444"}}>{v}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function Notifications({user,refreshKey}){
  const all=DB.getAll("notifications");
  const mine=all.filter(n=>n.targetUserId==="all"||n.targetUserId===user._id).sort((a,b)=>b._id.localeCompare(a._id));
  if(mine.length===0) return(
    <div style={{textAlign:"center",padding:"70px 0",color:"#CCC"}}><div style={{fontSize:44,marginBottom:10}}>🔔</div><p>No notifications</p></div>
  );
  return(
    <div>
      <h2 style={{margin:"0 0 18px",fontSize:20,fontWeight:800,color:"#1A237E"}}>🔔 Notifications <span style={{fontSize:13,color:"#888",fontWeight:400}}>({mine.length})</span></h2>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {mine.map(n=>(
          <div key={n._id} style={{background:"white",borderRadius:11,padding:"13px 16px",boxShadow:"0 2px 7px rgba(0,0,0,0.05)",display:"flex",gap:12,alignItems:"flex-start",border:"1px solid #F0F0F0"}}>
            <div style={{width:38,height:38,borderRadius:19,background:"#E8EAF6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon||"🔔"}</div>
            <div>
              <p style={{margin:0,fontWeight:700,color:"#1A237E",fontSize:13}}>{n.title}</p>
              <p style={{margin:"2px 0",color:"#666",fontSize:12}}>{n.message}</p>
              <p style={{margin:0,color:"#BBB",fontSize:10}}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App(){
  const [user,setUser]=useState(null);
  const [active,setActive]=useState("dashboard");
  const [cart,setCart]=useState([]);
  const [refreshKey,setRefreshKey]=useState(0);
  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);

  function handleLogin(u){setUser(u);setActive("dashboard");}
  function handleLogout(){setUser(null);setCart([]);setActive("dashboard");}

  function confirmOrder(cartItems,grandTotal){
    const u=user;
    const parentSS=u.role==="distributor"?DB.findOne("users",{_id:u.ssId}):u.role==="ss"?u:null;
    const order=DB.insert("orders",{
      id:genOrderId(),
      placedBy:u._id, placedByName:u.name, role:u.role,
      ssId:u.role==="ss"?u._id:(u.ssId||null),
      distId:u.role==="distributor"?u._id:null,
      district:u.district||"Nagpur",
      items:cartItems.map(i=>({...i})),
      grandTotal,status:"Draft",createdAt:Date.now()
    });
    pushNotif("✅","Order Placed",`Order ${order.id} placed for ₹${grandTotal.toFixed(2)} by ${u.name}`,u._id);
    if(parentSS) pushNotif("📦","New Order Received",`${u.name} placed order ${order.id} worth ₹${grandTotal.toFixed(2)}`,parentSS._id);
    setCart([]);setActive("orders");setRefreshKey(k=>k+1);
  }

  if(!user) return <LoginPage onLogin={handleLogin}/>;

  const role=user.role;
  const notifCount=DB.getAll("notifications").filter(n=>(n.targetUserId==="all"||n.targetUserId===user._id)&&!n.read).length;

  const pages={
    dashboard:<Dashboard role={role} user={user} refreshKey={refreshKey}/>,
    products:<ProductCatalog role={role} user={user} cart={cart} setCart={setCart}/>,
    basket:<Basket role={role} user={user} cart={cart} setCart={setCart} onConfirm={confirmOrder}/>,
    orders:<OrdersList role={role} user={user} refreshKey={refreshKey}/>,
    users:<ManageUsers role={role} user={user} refreshKey={refreshKey} setRefreshKey={setRefreshKey}/>,
    upload:<UploadRateSheet setRefreshKey={setRefreshKey}/>,
    notifications:<Notifications user={user} refreshKey={refreshKey}/>,
  };

  return(
    <div className="app-container">
      {/* Desktop Sidebar */}
      <div className="desktop-only" style={{ width: 216, height: "100vh", flexShrink: 0, position: "fixed", left: 0, top: 0, zIndex: 500 }}>
        <Sidebar role={role} user={user} active={active} setActive={setActive} onLogout={handleLogout} cartCount={cart.length} notifCount={notifCount}/>
      </div>
      
      {/* Main content offset for fixed sidebar */}
      <div style={{ marginLeft: "216px", width: "calc(100% - 216px)", display: "flex", flexDirection: "column" }}>
      
      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay mobile-only ${isMobileMenuOpen ? "open" : ""}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      {/* Mobile Drawer Sidebar */}
      <div className={`mobile-sidebar-drawer mobile-only ${isMobileMenuOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 12px 0" }}>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>
        <Sidebar 
          role={role} 
          user={user} 
          active={active} 
          setActive={(page) => { setActive(page); setIsMobileMenuOpen(false); }} 
          onLogout={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
          cartCount={cart.length} 
          notifCount={notifCount}
        />
      </div>

      <div className="main-content">
        {/* Desktop top navbar */}
        <div className="desktop-header desktop-only">
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: "#1A237E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🍦</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#1A237E" }}>Scoop Lovers</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, justifyContent: "center", maxWidth: 400 }}>
            <input type="text" placeholder="Search products, orders..." style={{ width: "100%", padding: "8px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "white", color: "#333", fontSize: 13, outline: "none" }} />
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {role !== "manager" && (
                <button onClick={() => setActive("basket")} style={{ background: "none", border: "none", color: "#1A237E", fontSize: 20, position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  🛒
                  {cart.length > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: "#FF6B9D", color: "white", fontSize: 8, fontWeight: 900, borderRadius: 8, padding: "1px 5px" }}>{cart.length}</span>}
                </button>
              )}
              <button onClick={() => setActive("notifications")} style={{ background: "none", border: "none", color: "#1A237E", fontSize: 20, position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
                🔔
                {notifCount > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: "#FF6B9D", color: "white", fontSize: 8, fontWeight: 900, borderRadius: 8, padding: "1px 5px" }}>{notifCount}</span>}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 10, borderLeft: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <span style={{ fontWeight: 700, color: "#1A237E", fontSize: 13 }}>{user.name}</span>
                  <span style={{ fontSize: 10, color: "#999", textTransform: "capitalize" }}>{role}</span>
                </div>
                <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#999", fontSize: 14, cursor: "pointer", padding: "4px 8px" }}>⊗</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile top navbar */}
        {user && (
          <div className="mobile-header">
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, marginLeft: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🍦</div>
              <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>Scoop Lovers</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button onClick={() => setActive("dashboard")} title={user.name} style={{ background: "none", border: "none", color: "#1A237E", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", padding: "4px 8px", borderRadius: 6 }}>👤</button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#1A237E", minWidth: 80 }}>
                <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 8 }}>
              {role !== "manager" && (
                <button onClick={() => setActive("basket")} style={{ background: "none", border: "none", color: "#1A237E", fontSize: 18, position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  🛒
                  {cart.length > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: "#FF6B9D", color: "white", fontSize: 8, fontWeight: 900, borderRadius: 8, padding: "1px 5px" }}>{cart.length}</span>}
                </button>
              )}
              <button onClick={() => setActive("notifications")} style={{ background: "none", border: "none", color: "#1A237E", fontSize: 18, position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
                🔔
                {notifCount > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: "#FF6B9D", color: "white", fontSize: 8, fontWeight: 900, borderRadius: 8, padding: "1px 5px" }}>{notifCount}</span>}
              </button>
              <button onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}} style={{ background: "none", border: "none", color: "#FF6B9D", fontSize: 14, cursor: "pointer", padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}>Exit</button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <div className="page-container">
            {pages[active]||pages.dashboard}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
