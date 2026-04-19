package com.buyerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.buyerservice.app.entity.OrderItemsEntity;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemsEntity, Long> {
}
