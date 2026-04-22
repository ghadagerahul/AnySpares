package com.anyspares.app.payload.response;

import com.anyspares.app.exception.ErrorDetail;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CommonResponse {

    private String status;
    private String correlationId;
    private List<?> data;
    private List<ErrorDetail> errors;

}
