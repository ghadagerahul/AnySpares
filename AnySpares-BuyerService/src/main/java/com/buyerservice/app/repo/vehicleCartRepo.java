package com.buyerservice.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.buyerservice.app.entity.MyBucketEntity;
import java.util.List;

@Repository
public interface vehicleCartRepo extends JpaRepository<MyBucketEntity, Long> {

//	@Query("""
//			    SELECT v
//			    FROM VehicleMybucket v
//			    WHERE v.user_id = :userId
//			""")
//	MyBucketEntity findByUserIdAndProductId(@Param("userId") long userId);
//	
	MyBucketEntity findByUserId(Long userId);

}
