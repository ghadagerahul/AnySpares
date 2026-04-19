package com.buyerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buyerservice.app.entity.VehicleCheckoutAddressEntity;

import java.util.List;

@Repository
public interface VehicleCheckoutAddressRepo extends JpaRepository<VehicleCheckoutAddressEntity, Long> {

	List<VehicleCheckoutAddressEntity> findByUserId(String userId);

	@Modifying
	@Query(value = """
			UPDATE vehicle_order_addresses
			SET is_default = 'N'
			WHERE id <> :id
			  AND user_id = :userId
			""", nativeQuery = true)
	void unselectDefaultAddresses(@Param("id") Long id, @Param("userId") String userId);

}
