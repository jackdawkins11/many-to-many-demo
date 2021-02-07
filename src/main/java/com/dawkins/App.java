package com.dawkins;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

/**
 * Hello world!
 *
 */
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

@RestController
@RequestMapping(path = "/rdb-api")
class MyController {

    @Autowired
    ProductRepo productRepo;

    @Autowired
    PurchaseRepo purchaseRepo;

    @GetMapping("/greeting")
    public String greet(@RequestParam(name = "name", defaultValue = "World") String name) {
        return "Hello " + name + "!";
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepo.findAll();
    }

    @PostMapping(value = "/products")
    public Product postProduct(@RequestBody Product entity) {
        return productRepo.save(entity);
    }

    @GetMapping("/purchases")
    public List<Purchase> getPurchases() {
        return purchaseRepo.findAll();
    }

    @PostMapping("/purchases")
    public Purchase postPurchase(@RequestBody Purchase purchase) {
        return purchaseRepo.save(purchase);
    }

    @PostMapping("/add/{productId}/{purchaseId}")
    public void addRelation(@PathVariable("productId") long productId, @PathVariable("purchaseId") long purchaseId) {
        Purchase purchase = purchaseRepo.findById(purchaseId).orElseThrow();
        purchase.getProducts().add(productRepo.findById(productId).orElseThrow());
        purchaseRepo.save(purchase);
    }

    @PostMapping("/delete/{productId}/{purchaseId}")
    public void deleteRelation(@PathVariable("productId") long productId, @PathVariable("purchaseId") long purchaseId) {
        Purchase purchase = purchaseRepo.findById(purchaseId).orElseThrow();
        purchase.getProducts().remove(productRepo.findById(productId).orElseThrow());
        purchaseRepo.save(purchase);
    }

}

@Entity
@Data
@Table(name = "product")
class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;
    String name;

    @ManyToMany(mappedBy = "products")
    @JsonIgnoreProperties("products")
    List<Purchase> purchases;
}

@Entity
@Data
@Table(name = "purchase")
class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;
    String name;

    @ManyToMany()
    @JsonIgnoreProperties("purchases")
    List<Product> products;
}

interface ProductRepo extends JpaRepository<Product, Long> {

}

interface PurchaseRepo extends JpaRepository<Purchase, Long> {

}