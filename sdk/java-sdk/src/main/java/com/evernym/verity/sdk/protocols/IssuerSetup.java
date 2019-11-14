package com.evernym.verity.sdk.protocols;

import com.evernym.verity.sdk.exceptions.UndefinedContextException;
import com.evernym.verity.sdk.exceptions.WalletException;
import com.evernym.verity.sdk.utils.Context;
import com.evernym.verity.sdk.utils.Util;
import org.json.JSONObject;

import java.io.IOException;

public class IssuerSetup extends Protocol {

    public static String CREATE = "create";

    final private static String MSG_QUALIFIER = Util.EVERNYM_MSG_QUALIFIER;
    final public static String MSG_FAMILY = "issuer-setup";
    final public static String MSG_FAMILY_VERSION = "0.6";

    public IssuerSetup() {
        super();

        defineMessages();
    }

    @Override
    protected void defineMessages() {
        JSONObject message = new JSONObject();
        message.put("@type", IssuerSetup.getMessageType(CREATE));
        message.put("@id", IssuerSetup.getNewId());
        this.messages.put(CREATE, message);
    }

    public static String getMessageType(String msgName) {
        return Util.getMessageType(MSG_QUALIFIER, MSG_FAMILY, MSG_FAMILY_VERSION, msgName);
    }

    public byte[] create(Context context) throws IOException, UndefinedContextException, WalletException {
        return this.send(context, this.messages.getJSONObject(CREATE));
    }
}
