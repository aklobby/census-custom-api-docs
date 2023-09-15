// Mimimal conforming custom connection implementation - zero external
// dependencies

const server = {};

server.test_connection = () => {
  return { success: true };
};

server.list_objects = () => {
  return {
    objects: [
      { object_api_name: "customer", label: "Customers" },
      { object_api_name: "event", label: "Events", can_create_fields: 'on_write' },
    ],
  };
};

server.supported_operations = ({ object }) => {
  console.log("listing operations for object", object);
  return { operations: ["upsert"] };
};

server.list_fields = ({ object }) => {
  console.log("listing fields for object", object);
  return {
    fields: [
      {
        field_api_name: "id",
        label: "ID",
        identifier: true,
        createable: false,
        updateable: false,
        type: "string",
        required: true,
        array: false,
      },
      {
        field_api_name: "firstName",
        label: "First Name",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: true,
        array: false,
      },
      {
        field_api_name: "lastName",
        label: "Last Name",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: true,
        array: false,
      },
      {
        field_api_name: "contactEmails",
        label: "Contact Emails",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: false,
        array: true, // Assuming it's an array of strings
      },
      {
        field_api_name: "contactPhones",
        label: "Contact Phones",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: false,
        array: true, // Assuming it's an array of strings
      },
      {
        field_api_name: "vehicleId",
        label: "Vehicle ID",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: false,
        array: false,
      },
      {
        field_api_name: "preferredContactMethod",
        label: "Preferred Contact Method",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: false,
        array: false,
      },
      {
        field_api_name: "referralSource",
        label: "Referral Source",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: false,
        array: false,
      },
      {
        field_api_name: "zip",
        label: "ZIP",
        identifier: false,
        createable: true,
        updateable: true,
        type: "string",
        required: false,
        array: false,
      },
    ],
  };
};


server.get_sync_speed = () => {
  console.log("get sync speed");
  return {
    maximum_batch_size: 200,
    maximum_records_per_second: 100,
    maximum_parallel_batches: 4,
  };
};

server.sync_batch = ({ sync_plan, records }) => {
  console.log("sync one batch of data", { sync_plan, records });
  return {
    record_results: records.map((record, index) => {
      success = [true, false][index % 2];
      return {
        identifier: record.email,
        success,
        error_message: success ? null : "oops!",
      };
    }),
  };
};

// Run as a AWS Lambda-style handler function

exports.handler = async function(event, context) {
  const requestBodyBuffer = event.body;
  const { id, method, params } = JSON.parse(requestBodyBuffer);

  const result = server[method](params);

  const response = {
    jsonrpc: "2.0",
    id,
    result,
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
}

// Run as a regular node process

// const port = 6161;

// require("http")
//   .createServer((req, res) => {
//     var requestBodyBuffer = "";
//     req.on("data", (chunk) => (requestBodyBuffer += chunk));
//     req.on("end", () => {
//       //console.log({requestBody})
//       const { id, method, params } = JSON.parse(requestBodyBuffer);

//       const result = server[method](params);

//       const body = {
//         jsonrpc: "2.0",
//         id,
//         result,
//       };

//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.write(JSON.stringify(body));
//       res.end();
//     });
//   })
//   .listen(port);
