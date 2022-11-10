package com.dawkins;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;

import org.json.simple.JSONObject;

import java.util.ArrayList;

/**
 * Unit test for simple App.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class AppTest 
{
	@LocalServerPort
	private int port;

	@Autowired
	private TestRestTemplate restTemplate;
  
	@Test
    	public void shouldAnswerWithTrue() throws Exception
    	{
		HttpHeaders headers = new HttpHeaders();
    		headers.setContentType(MediaType.APPLICATION_JSON);
    		JSONObject prod1JSON = new JSONObject();
    		prod1JSON.put("purchases", new ArrayList<Integer>());
    		prod1JSON.put("name", "Spinach");

		HttpEntity<String> request = 
     	 		new HttpEntity<String>(prod1JSON.toString(), headers);

		Product prod1 = this.restTemplate.postForObject("http://localhost:" + port + "/rdb-api/products",
				request, Product.class);

		System.out.println(prod1);

		assertTrue( prod1.getName().equals( "Spinach" ) );

    	}
	
	@Test
    	public void shouldAnswerWithTrue2()
    	{
		HttpHeaders headers = new HttpHeaders();
    		headers.setContentType(MediaType.APPLICATION_JSON);
    		JSONObject prod1JSON = new JSONObject();
    		prod1JSON.put("purchases", new ArrayList<Integer>());
    		prod1JSON.put("name", "Apples");
    		JSONObject prod2JSON = new JSONObject();
    		prod2JSON.put("purchases", new ArrayList<Integer>());
    		prod2JSON.put("name", "Carrots");

		HttpEntity<String> request = 
     	 		new HttpEntity<String>(prod1JSON.toString(), headers);

		Product prod1 = this.restTemplate.postForObject("http://localhost:" + port + "/rdb-api/products",
				request, Product.class);
		
		request = new HttpEntity<String>(prod2JSON.toString(), headers);
		
		Product prod2 = this.restTemplate.postForObject("http://localhost:" + port + "/rdb-api/products",
				request, Product.class);

		Product[] prods = this.restTemplate.getForObject( "http://localhost:" + port + "/rdb-api/products",
				Product[].class);

		for( Product p : prods ){
			System.out.println( "From returned list" );
			System.out.println( p );
		}

    	}
}
